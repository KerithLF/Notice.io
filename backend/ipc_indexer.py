# ipc_indexer.py
import pdfplumber, faiss, os
from sentence_transformers import SentenceTransformer
import numpy as np
import re
from typing import List, Dict
import os
import requests
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"


def call_groq(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }
    res = requests.post(GROQ_URL, headers=headers, json=payload)
    if res.status_code == 200:
        return res.json()["choices"][0]["message"]["content"].strip()
    raise Exception(f"GROQ API Error {res.status_code}: {res.text}")


def get_ipc_recommendations(subject: str, incidents: List[str]) -> List[Dict[str, str]]:
    try:
        # Create a prompt for the LLM
        incidents_text = "\n".join(f"- {incident}" for incident in incidents)
        prompt = f"""Based on the following legal case details, recommend relevant IPC (Indian Penal Code) sections that may be applicable:

Subject: {subject}

Incidents:
{incidents_text}

Please provide 5 most relevant IPC sections that could be applicable to this case. For each section, include:
1. The section number
2. The title of the section
3. A brief explanation of why it's relevant to this case
4. Some main keywords that summarize the section

Format your response as a list of sections, each starting with "Section" followed by the number. For example:

Section 420: Cheating and dishonestly inducing delivery of property
This section deals with fraudulent behavior...
Keywords: cheating, fraud, dishonesty

Section 406: Criminal breach of trust
This section applies when...
Keywords: breach of trust, criminal liability

Please provide the recommendations now:"""

        response = call_groq(prompt)

        # Parse the response into structured recommendations
        recommendations = []
        current_section = {}
        
        for line in response.split('\n'):
            line = line.strip()
            if not line:
                continue
                
            if line.lower().startswith('section'):
                # Save previous section if it exists
                if current_section and all(key in current_section for key in ['section', 'title', 'description']):
                    recommendations.append(current_section)
                current_section = {"section": "", "title": "", "description": ""}
                # Extract section number and title
                parts = line.split(':', 1)
                current_section["section"] = parts[0].strip()
                if len(parts) > 1:
                    current_section["title"] = parts[1].strip()
            elif current_section:
                # If we have a current section, add non-empty lines to description
                if current_section["description"]:
                    current_section["description"] += " " + line
                else:
                    # If it's the first line after section and we don't have a title
                    if not current_section["title"]:
                        current_section["title"] = line
                    else:
                        current_section["description"] = line

        # Add the last section
        if current_section and all(key in current_section for key in ['section', 'title', 'description']):
            recommendations.append(current_section)

        # If no recommendations were parsed, raise an error
        if not recommendations:
            raise Exception("Failed to parse IPC recommendations from LLM response")

        return recommendations

    except Exception as e:
        print(f"Error in get_ipc_recommendations: {str(e)}")
        print(f"LLM Response: {response if 'response' in locals() else 'No response'}")
        raise Exception(f"Failed to get IPC recommendations: {str(e)}")

def extract_ipc_sections(pdf_path):
    sections = []
    current_section = ""
    current_text = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            
            # Split into lines and process each line
            lines = text.split('\n')
            for line in lines:
                # Skip empty lines and table of contents
                if not line.strip() or "ARRANGEMENT OF SECTIONS" in line:
                    continue
                    
                # Try to detect section headers (e.g., "Section 420: Cheating")
                section_match = re.match(r'^(?:Section\s+)?(\d+[A-Z]?)\.\s+(.+)', line)
                
                if section_match:
                    # If we have content from previous section, save it
                    if current_section and current_text:
                        full_section = current_section + "\n" + "\n".join(current_text)
                        sections.append(full_section.strip())
                        current_text = []
                    
                    # Start new section
                    section_num, title = section_match.groups()
                    current_section = f"Section {section_num}: {title}"
                else:
                    # Skip chapter headings and page numbers
                    if not re.match(r'^(CHAPTER|SECTIONS|\d+)$', line.strip()):
                        # Add line to current section description
                        if current_section and line.strip():
                            current_text.append(line.strip())
    
    # Add the last section
    if current_section and current_text:
        full_section = current_section + "\n" + "\n".join(current_text)
        sections.append(full_section.strip())
    
    return sections

# Get the absolute path to the PDF file
current_dir = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(os.path.dirname(current_dir), "ipc_sections.pdf")

# 1. Extract sections
text_chunks = extract_ipc_sections(pdf_path)

# 2. Embed
model = SentenceTransformer('all-MiniLM-L6-v2')  # light-weight local embedding model
embeddings = model.encode(text_chunks, convert_to_numpy=True)

# 3. Store in FAISS
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))

# Save index and metadata
index_path = os.path.join(os.path.dirname(current_dir), "ipc_index.faiss")
chunks_path = os.path.join(os.path.dirname(current_dir), "ipc_chunks.txt")

faiss.write_index(index, index_path)
with open(chunks_path, "w", encoding="utf-8") as f:
    for c in text_chunks:
        f.write(c + "\n<|CHUNK|>\n")

# For reuse in other modules
index = faiss.read_index(index_path)
chunks = open(chunks_path, encoding="utf-8").read().split("<|CHUNK|>\n")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def get_ipc_sections(query, top_k=5):
    query_vec = embedder.encode([query], convert_to_numpy=True)
    D, I = index.search(query_vec, top_k)
    results = [chunks[i] for i in I[0]]
    return results