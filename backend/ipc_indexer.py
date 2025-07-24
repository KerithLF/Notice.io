# ipc_indexer.py
import pdfplumber, faiss, os
from sentence_transformers import SentenceTransformer
import numpy as np
import re

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