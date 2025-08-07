import pandas as pd
import numpy as np
import faiss
import json
from sentence_transformers import SentenceTransformer
import os
from typing import List, Dict
import requests

from backend.generator import call_groq


class LitigationAwareIPCRecommender:
    def __init__(self, csv_path: str = "ipc_sect1ons.csv"):
        """Initialize the recommender with litigation type mappings"""
        self.df = self.load_and_prepare_data(csv_path)
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.litigation_act_mapping = {
            # Cheque Bounce cases - only Negotiable Instruments Act
            'cheque bounce': ['THE NEGOTIABLE INSTRUMENTS ACT, 1882'],
            'dishonour of cheque': ['THE NEGOTIABLE INSTRUMENTS ACT, 1882'],
            
            # Company/Corporate disputes
            'oppression': ['COMPANIES ACT, 2013'],
            'mismanagement': ['COMPANIES ACT, 2013'],
            'corporate dispute': ['COMPANIES ACT, 2013'],
            'director duties': ['COMPANIES ACT, 2013'],
            'dividend': ['COMPANIES ACT, 2013'],
            'company law': ['COMPANIES ACT, 2013'],
            
            # Partnership disputes
            'partnership dispute': ['THE INDIAN PARTNERSHIP ACT, 1932', 'LIMITED LIABILITY PARTNERSHIP ACT, 2008'],
            'llp dispute': ['LIMITED LIABILITY PARTNERSHIP ACT, 2008'],
            'firm dissolution': ['THE INDIAN PARTNERSHIP ACT, 1932'],
            
            # Criminal cases - Bharata Nyaya Sanhita
            'criminal': ['BHARATA NYAYA SANHITA, 2023'],
            'fraud': ['BHARATA NYAYA SANHITA, 2023', 'COMPANIES ACT, 2013'],
            'theft': ['BHARATA NYAYA SANHITA, 2023'],
            'assault': ['BHARATA NYAYA SANHITA, 2023'],
            'murder': ['BHARATA NYAYA SANHITA, 2023'],
            'rape': ['BHARATA NYAYA SANHITA, 2023'],
            'dowry death': ['BHARATA NYAYA SANHITA, 2023'],
            'kidnapping': ['BHARATA NYAYA SANHITA, 2023'],
            'extortion': ['BHARATA NYAYA SANHITA, 2023'],
            
            # Securities related
            'securities fraud': ['THE SECURITIES EXCHANGE BOARD OF INDIA ACT, 1992'],
            'insider trading': ['THE SECURITIES EXCHANGE BOARD OF INDIA ACT, 1992'],
            'market manipulation': ['THE SECURITIES EXCHANGE BOARD OF INDIA ACT, 1992'],
        }
        
        # Create embeddings for all sections
        self.create_embeddings()
    
    def load_and_prepare_data(self, csv_path: str) -> pd.DataFrame:
        """Load and clean the CSV data"""
        try:
            df = pd.read_csv(csv_path, encoding='utf-8')
            df = df.fillna('')
            
            # Clean and standardize data
            df['Acts'] = df['Acts'].str.strip()
            df['Keywords'] = df['Keywords'].str.strip()
            df['Sections'] = df['Sections'].str.strip()
            
            # Create combined text for better matching
            df['combined_text'] = df['Acts'] + ' ' + df['Keywords'] + ' ' + df['Sections']
            
            return df
        except Exception as e:
            print(f"Error loading CSV: {e}")
            raise
    
    def create_embeddings(self):
        """Create embeddings for all sections"""
        # Filter out empty combined texts
        valid_texts = [text for text in self.df['combined_text'] if text.strip()]
        self.valid_indices = [i for i, text in enumerate(self.df['combined_text']) if text.strip()]
        
        if valid_texts:
            self.embeddings = self.embedder.encode(valid_texts, convert_to_numpy=True)
            
            # Create FAISS index
            self.index = faiss.IndexFlatL2(self.embeddings.shape[1])
            self.index.add(np.array(self.embeddings))
        else:
            raise ValueError("No valid texts found for embedding")
    
    def get_applicable_acts(self, litigation_type: str, sub_type: str = None) -> List[str]:
        """Get applicable acts based on litigation type and sub-type"""
        # Combine litigation type and sub-type for lookup
        lookup_keys = []
        
        if sub_type:
            lookup_keys.append(sub_type.lower())
        lookup_keys.append(litigation_type.lower())
        
        # Find matching acts
        applicable_acts = set()
        for key in lookup_keys:
            for mapping_key, acts in self.litigation_act_mapping.items():
                if mapping_key in key or key in mapping_key:
                    applicable_acts.update(acts)
        
        # If no specific mapping found, return all acts (fallback)
        if not applicable_acts:
            applicable_acts = set(self.df['Acts'].unique())
        
        return list(applicable_acts)
    
    def get_recommendations(self, litigation_type: str, sub_type: str, subject: str, 
                          incidents: List[str], top_k: int = 5) -> List[Dict]:
        """Get IPC recommendations filtered by litigation type"""
        
        # Get applicable acts for this litigation type
        applicable_acts = self.get_applicable_acts(litigation_type, sub_type)
        print(f"🔍 Applicable acts for {litigation_type}/{sub_type}: {applicable_acts}")
        
        # Filter dataframe to only include applicable acts
        filtered_df = self.df[self.df['Acts'].isin(applicable_acts)].copy()
        
        if filtered_df.empty:
            return []
        
        # Create query text
        incidents_text = " ".join(incidents) if incidents else ""
        query_text = f"{subject} {incidents_text}".strip()
        
        if not query_text:
            # If no query text, return top sections from applicable acts
            return self._format_recommendations(filtered_df.head(top_k), query_text)
        
        # Use semantic search on filtered data
        try:
            # Get embeddings for filtered sections
            filtered_indices = filtered_df.index.tolist()
            
            # Find which of our valid indices correspond to filtered dataframe
            relevant_embedding_indices = []
            for i, orig_idx in enumerate(self.valid_indices):
                if orig_idx in filtered_indices:
                    relevant_embedding_indices.append(i)
            
            if not relevant_embedding_indices:
                return self._format_recommendations(filtered_df.head(top_k), query_text)
            
            # Create sub-embeddings for filtered data
            filtered_embeddings = self.embeddings[relevant_embedding_indices]
            
            # Create temporary index
            temp_index = faiss.IndexFlatL2(filtered_embeddings.shape[1])
            temp_index.add(filtered_embeddings)
            
            # Search
            query_embedding = self.embedder.encode([query_text], convert_to_numpy=True)
            scores, indices = temp_index.search(query_embedding, min(top_k, len(relevant_embedding_indices)))
            
            # Map back to original dataframe indices
            selected_indices = []
            for idx in indices[0]:
                if idx < len(relevant_embedding_indices):
                    orig_embedding_idx = relevant_embedding_indices[idx]
                    orig_df_idx = self.valid_indices[orig_embedding_idx]
                    selected_indices.append(orig_df_idx)
            
            # Get the selected rows
            selected_df = self.df.iloc[selected_indices]
            return self._format_recommendations(selected_df, query_text)
            
        except Exception as e:
            print(f"Error in semantic search: {e}")
            # Fallback to keyword matching
            return self._keyword_fallback(filtered_df, query_text, top_k)
    
    def _keyword_fallback(self, filtered_df: pd.DataFrame, query_text: str, top_k: int) -> List[Dict]:
        """Fallback keyword-based matching"""
        query_words = set(query_text.lower().split())
        
        # Score based on keyword overlap
        def calculate_score(row):
            text = f"{row['Keywords']} {row['Sections']}".lower()
            text_words = set(text.split())
            overlap = len(query_words.intersection(text_words))
            return overlap
        
        filtered_df['score'] = filtered_df.apply(calculate_score, axis=1)
        top_matches = filtered_df.nlargest(top_k, 'score')
        
        return self._format_recommendations(top_matches, query_text)
    
    def _format_recommendations(self, df_subset: pd.DataFrame, query_text: str) -> List[Dict]:
        """Format recommendations with explanations"""
        recommendations = []
        
        for _, row in df_subset.iterrows():
            explanation = self._generate_explanation(
                row['Acts'], row['Sections'], row['Keywords'], query_text
            )
            
            recommendations.append({
                'section': row['Sections'],
                'act': row['Acts'],
                'title': row['Keywords'],
                'description': explanation,
                'applicability': f"Applicable for cases involving {row['Keywords'].lower()}"
            })
        
        return recommendations
    
    def _generate_explanation(self, act: str, section: str, keywords: str, case_details: str) -> str:
        """Generate explanation using Groq LLM"""
        prompt = f"""
        As a legal expert, explain why {section} of {act} is applicable to this case.
        
        Section Details:
        - Act: {act}
        - Section: {section}
        - Keywords: {keywords}
        
        Case Details: {case_details}
        
        Provide a clear, concise explanation (2-3 sentences) of why this section applies to the case.
        Focus on the connection between the section's purpose and the case circumstances.
        """
        
        try:
            explanation = call_groq(prompt)
            return explanation.strip()
        except Exception as e:
            print(f"Error generating explanation: {e}")
            return f"This section of {act} deals with {keywords.lower()} which is relevant to your case circumstances."

# Global instance
recommender = None

def get_litigation_aware_recommendations(litigation_type: str, sub_type: str, subject: str, 
                                      incidents: List[str], top_k: int = 5) -> List[Dict]:
    """Main function to get recommendations"""
    global recommender
    
    if recommender is None:
        recommender = LitigationAwareIPCRecommender()
    
    return recommender.get_recommendations(litigation_type, sub_type, subject, incidents, top_k)

# Backward compatibility functions
def get_ipc_recommendations(subject: str, incidents: List[str]) -> List[Dict[str, str]]:
    """Backward compatible function"""
    global recommender
    
    if recommender is None:
        recommender = LitigationAwareIPCRecommender()
    
    # Default to general criminal law if no specific type
    recommendations = recommender.get_recommendations("criminal", "", subject, incidents)
    
    # Format for backward compatibility
    return [
        {
            'section': rec['section'],
            'title': rec['title'],
            'description': rec['description']
        }
        for rec in recommendations
    ]

class SemanticEmbedder:
    """Backward compatibility class"""
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
    
    def encode(self, texts):
        return self.model.encode(texts, convert_to_tensor=True)

def load_ipc_data(file_path: str):
    """Backward compatibility function"""
    return pd.read_csv(file_path).fillna('')

class IPCRetriever:
    """Backward compatibility class"""
    def __init__(self, embedder, df):
        # This is now handled by LitigationAwareIPCRecommender
        pass
    
    def recommend(self, query: str, top_k: int = 5):
        # Use the new recommender
        global recommender
        if recommender is None:
            recommender = LitigationAwareIPCRecommender()
        
        # Default recommendations
        recommendations = recommender.get_recommendations("general", "", query, [], top_k)
        
        # Convert to DataFrame for backward compatibility
        data = []
        for rec in recommendations:
            data.append({
                'Acts': rec['act'],
                'Sections': rec['section'],
                'Keywords': rec['title']
            })
        
        return pd.DataFrame(data)
