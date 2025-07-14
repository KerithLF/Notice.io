import os
import docx
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join(p.text for p in doc.paragraphs)

def extract_text_from_pdf(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            return "\n".join(page.extract_text() or '' for page in pdf.pages)
    except:
        return extract_text_from_scanned_pdf(file_path)

def extract_text_from_scanned_pdf(file_path):
    images = convert_from_path(file_path)
    return "\n".join(pytesseract.image_to_string(img) for img in images)

def extract_text_from_image(file_path):
    return pytesseract.image_to_string(Image.open(file_path))

def extract_text_from_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def extract_text_from_any(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext == '.docx':
        return extract_text_from_docx(file_path)
    elif ext == '.txt':
        return extract_text_from_txt(file_path)
    elif ext in ['.jpg', '.jpeg', '.png']:
        return extract_text_from_image(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
