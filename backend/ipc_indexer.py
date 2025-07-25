# ipc_indexer.py
import pdfplumber, faiss, os
from sentence_transformers import SentenceTransformer
import numpy as np
import re
from typing import List, Dict
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY environment variable is not set. Please set it in your .env file.")

def get_ipc_recommendations(subject: str, incidents: List[str]) -> List[Dict[str, str]]:
    try:
        # Create a prompt for the LLM
        incidents_text = "\n".join(f"- {incident}" for incident in incidents)
        prompt = f"""Based on the following legal case details, recommend relevant IPC (Indian Penal Code) sections that may be applicable:

Subject: {subject}

Incidents:
{incidents_text}

Please provide 3-5 most relevant IPC sections that could be applicable to this case. For each section, include:
1. The section number
2. The title of the section
3. A brief explanation of why it's relevant to this case

Format your response as a list of sections, each starting with "Section" followed by the number. For example:

Section 420: Cheating and dishonestly inducing delivery of property
This section deals with fraudulent behavior...

Section 406: Criminal breach of trust
This section applies when...

Please provide the recommendations now:"""

        # Call the LLM
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a legal expert specializing in Indian Penal Code (IPC). You can accurately identify and explain relevant IPC sections based on case details."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=2000
        )

        if not chat_completion.choices:
            raise Exception("No response received from LLM")
        
        response = chat_completion.choices[0].message.content
        if not response:
            raise Exception("Empty response received from LLM")

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