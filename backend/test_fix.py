#!/usr/bin/env python3
"""
Test script to verify the IPC data loading fixes
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import pandas as pd
    print("✓ pandas imported successfully")
except ImportError:
    print("✗ pandas not available")
    sys.exit(1)

try:
    from ipc_indexer import load_ipc_data, SemanticEmbedder, IPCRetriever
    print("✓ ipc_indexer modules imported successfully")
except ImportError as e:
    print(f"✗ Error importing ipc_indexer: {e}")
    sys.exit(1)

def test_ipc_data_loading():
    """Test IPC data loading"""
    try:
        # Test loading the CSV file
        df = load_ipc_data("../ipc_sections.csv")
        print(f"✓ CSV loaded successfully with {len(df)} rows")
        print(f"✓ Columns: {df.columns.tolist()}")
        
        # Test the combined column creation
        if 'combined' in df.columns:
            print("✓ Combined column created successfully")
            print(f"✓ Sample combined text: {df['combined'].iloc[0][:100]}...")
        else:
            print("✗ Combined column not found")
            return False
            
        return True
        
    except Exception as e:
        print(f"✗ Error loading IPC data: {e}")
        return False

def test_retriever():
    """Test the IPC retriever"""
    try:
        df = load_ipc_data("../ipc_sections.csv")
        embedder = SemanticEmbedder()
        retriever = IPCRetriever(embedder, df)
        
        # Test a simple query
        results = retriever.recommend("fraud cheating", top_k=3)
        print(f"✓ Retriever works, got {len(results)} results")
        print(f"✓ Result columns: {results.columns.tolist()}")
        
        return True
        
    except Exception as e:
        print(f"✗ Error testing retriever: {e}")
        return False

if __name__ == "__main__":
    print("Testing IPC data loading fixes...")
    
    if test_ipc_data_loading():
        print("✓ IPC data loading test passed")
    else:
        print("✗ IPC data loading test failed")
        sys.exit(1)
        
    if test_retriever():
        print("✓ IPC retriever test passed")
    else:
        print("✗ IPC retriever test failed")
        sys.exit(1)
        
    print("✓ All tests passed!") 