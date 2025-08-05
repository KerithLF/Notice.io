#!/usr/bin/env python3
"""
Test script for PDF generation functionality
"""

from generator import save_to_pdf
import os

def test_pdf_generation():
    """Test PDF generation with sample text"""
    
    # Sample legal notice text
    sample_text = """Date: 15th December 2024

Subject: Legal Notice

To,
John Doe
S/o John Smith
123 Main Street
City, State - 123456

Dear Sir/Madam,

This is a sample legal notice for testing purposes.

Yours Faithfully,
Test Lawyer
"""

    try:
        # Generate PDF
        pdf_path = save_to_pdf(sample_text, "test_notice.pdf")
        
        # Check if file exists
        if os.path.exists(pdf_path):
            print(f"✅ PDF generated successfully: {pdf_path}")
            print(f"File size: {os.path.getsize(pdf_path)} bytes")
            
            # Clean up
            os.remove(pdf_path)
            print("✅ Test file cleaned up")
        else:
            print("❌ PDF file was not created")
            
    except Exception as e:
        print(f"❌ PDF generation failed: {e}")

if __name__ == "__main__":
    test_pdf_generation() 