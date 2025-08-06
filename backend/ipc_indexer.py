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


import json

def get_ipc_recommendations(subject: str, incidents: List[str]) -> List[Dict[str, str]]:

    df = pd.read_csv("ipc_sect1ons.csv")
    # Convert all columns to string to avoid dtype warnings
    for col in df.columns:
        df[col] = df[col].astype(str)
    df.fillna('', inplace=True)
    # Handle the correct column names from the CSV
    # The CSV has: "COMPANY LAWS - ", "Acts", "Id.No", "Keywords", "Sections"
    df['combined'] = df['Acts'] + ' ' + df['Keywords'] + ' ' + df['Sections']

    try:
        incidents_text = "\n".join(f"- {incident}" for incident in incidents)

        prompt = f"""
You are an expert Indian legal assistant. Based on the case information below, return only the applicable IPC sections from the {df} in the following JSON format:

[
  {{
    "section": "420",
    "title": "Cheating and dishonestly inducing delivery of property",
    "description": "This section is applicable because the accused committed fraud and obtained services without paying.",
    "keywords": ["cheating", "fraud", "dishonesty"]
  }},
  ...
]

Do not include any explanations or text before or after the JSON.

Subject: {subject}

Incidents:
{incidents_text}
"""

        response = call_groq(prompt)

        ipc_data = json.loads(response)

        if not isinstance(ipc_data, list) or not all('section' in s and 'title' in s and 'description' in s for s in ipc_data):
            raise ValueError("Invalid structure in LLM response.")

        # # Optional: Drop keywords if you don’t need them
        # for section in ipc_data:
        #     section.pop('keywords', None)

        return ipc_data

    except Exception as e:
        print(f"Error in get_ipc_recommendations: {str(e)}")
        print(f"LLM Response: {response if 'response' in locals() else 'No response'}")
        raise Exception(f"Failed to get IPC recommendations: {str(e)}")


import os
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

def extract_ipc_sections_from_csv(csv_path):
    """Extract IPC sections from CSV file"""
    try:
        # Read CSV file
        df = pd.read_csv(csv_path, encoding='utf-8')
        
        # Assuming CSV has columns like: 'section', 'description', 'details', etc.
        # Adjust column names based on your CSV structure
        text_chunks = []
        
        for _, row in df.iterrows():
            # Combine relevant columns into text chunks
            # Modify these column names based on your CSV structure
            chunk_parts = []

            if 'Acts' in df.columns and pd.notna(row['Acts']):
                chunk_parts.append(f"Title: {row['Acts']}")
            
            if 'Keywords' in df.columns and pd.notna(row['Keywords']):
                chunk_parts.append(f"Keywords: {row['Keywords']}")

            if 'Sections' in df.columns and pd.notna(row['Sections']):
                chunk_parts.append(f"Sections: {row['Sections']}")
            
            # if 'details' in df.columns and pd.notna(row['details']):
            #     chunk_parts.append(f"Details: {row['details']}")
            
            # if 'applicability' in df.columns and pd.notna(row['applicability']):
            #     chunk_parts.append(f"Applicability: {row['applicability']}")
            
            # Join all parts into a single chunk
            if chunk_parts:
                chunk = " | ".join(chunk_parts)
                text_chunks.append(chunk)
        
        return text_chunks
    
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return []

# Main code with CSV integration
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(os.path.dirname(current_dir), "ipc_sect1ons.csv")

# 1. Extract sections from CSV
text_chunks = extract_ipc_sections_from_csv(csv_path)

if not text_chunks:
    print("No data extracted from CSV. Please check the file and column names.")
    exit()

print(f"Extracted {len(text_chunks)} sections from CSV")

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

print(f"FAISS index saved to: {index_path}")
print(f"Text chunks saved to: {chunks_path}")

# For reuse in other modules
index = faiss.read_index(index_path)
chunks = open(chunks_path, encoding="utf-8").read().split("<|CHUNK|>\n")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

print("Setup complete. Ready for IPC section recommendations.")



def get_ipc_sections(query, top_k=5):
    query_vec = embedder.encode([query], convert_to_numpy=True)
    D, I = index.search(query_vec, top_k)
    results = [chunks[i] for i in I[0]]
    return results








# backend/recommender/semantic_model.py
from sentence_transformers import SentenceTransformer

class SemanticEmbedder:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def encode(self, texts):
        return self.model.encode(texts, convert_to_tensor=True)



# backend/recommender/utils.py
import pandas as pd

def load_ipc_data(file_path: str):
    try:
        df = pd.read_csv(file_path)
        # Ensure required columns exist
        required_columns = ['Sections', 'Acts', 'Keywords']
        if not all(col in df.columns for col in required_columns):
            raise ValueError(f"CSV file must contain columns: {required_columns}")
        
        # Clean the data
        df = df.fillna('')
        # Create combined text for better matching
        df['combined'] = df['Acts'] + ' ' + df['Sections'] + ' ' + df['Keywords']
        return df
    except Exception as e:
        print(f"Error loading IPC data: {e}")
        raise



# backend/recommender/retriever.py
from sklearn.metrics.pairwise import cosine_similarity

class IPCRetriever:
    def __init__(self, embedder, df):
        self.df = df
        self.embedder = embedder
        
        # Clean and prepare texts for embedding
        self.texts = df['combined'].fillna('').tolist()
        # Remove empty texts and create valid indices mapping
        self.valid_indices = [i for i, text in enumerate(self.texts) if text.strip()]
        self.valid_texts = [self.texts[i] for i in self.valid_indices]
        
        if not self.valid_texts:
            raise ValueError("No valid texts found in DataFrame")
            
        # Create embeddings for valid texts only
        self.embeddings = embedder.encode(self.valid_texts)

    def recommend(self, query: str, top_k: int = 5):
        if not query or not query.strip():
            return pd.DataFrame(columns=['Acts', 'Sections', 'Keywords'])
            
        # Encode query and get similarities
        query_embedding = self.embedder.encode([query.strip()])
        similarities = cosine_similarity(query_embedding, self.embeddings)[0]
        
        # Get top matches using valid indices
        top_indices = similarities.argsort()[::-1][:top_k]
        original_indices = [self.valid_indices[i] for i in top_indices]
        
        # Return matched rows from original dataframe
        return self.df.iloc[original_indices][['Acts', 'Sections', 'Keywords']]
