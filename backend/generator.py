import os
import re
import requests
from dotenv import load_dotenv
from backend.templates import TEMPLATES, PLACEHOLDER_ALIASES
from backend.utils import normalize_fuzzy_placeholders

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



def classify_notice_type(description: str) -> str:
    prompt = f"""
You are a legal assistant. Classify the notice type for the following case:

\"\"\"{description}\"\"\"

Choose from:
- Payment Recovery
- Employment Termination
- Contract Breach
- Loan Default
- Eviction Notice
- Loan Default Notice
- Cheque Bounce / Dishonour of Cheque Notice
- Consumer Complaint Notice
- Defamation / Harassment Notice
- Lease Termination Notice
- Legal Demand Notice (General)
"""
    return call_groq(prompt)



def summarize_incident(description: str, tone="formal") -> str:
    prompt = f"""
You are a legal assistant. Summarize the following incident in a {tone} legal tone:

\"\"\"{description}\"\"\"
"""
    return call_groq(prompt)



def recommend_ipc_llm(description: str) -> list:
    prompt = f"""
You are a legal expert assistant. Based on the following case description, recommend the most relevant IPC (Indian Penal Code) sections (Top 5 sections) with their section number, title, and a brief description why they apply:

Case Description:
""{description}""

Respond in this format:
- Section 420: Cheating
               Explanaation
- Section 448: House Trespass
               Explanation
- ...
"""

    response = call_groq(prompt)
    return response.strip().split("\\n")


def fill_notice_template(notice_type: str, data: dict, summarized_body: str) -> str:
    template = TEMPLATES.get(notice_type)
    if not template:
        raise ValueError(f"No template for notice type: {notice_type}")

    filled = template.format(
        issue_date=data.get("issue_date", ""),
        problem_date=data.get("problem_date", ""),
        recipient_name=data.get("recipient_name", ""),
        recipient_address=data.get("recipient_address", ""),
        subject=data.get("subject", "Regarding your legal obligation"),
        total_amount=data.get("total_amount", ""),
        sender_name=data.get("sender_name", ""),
        sender_address=data.get("sender_address", ""),
        notice_type=notice_type,
        summarized_body=summarized_body,
        signature=data.get("signature", ""),
        title=data.get("title", ""),
        company=data.get("company", ""),
        recipient_title=data.get("recipient_title", ""),
        recipient_company=data.get("recipient_company", ""),
        notice_period=data.get("notice_period", "")
    )

    return normalize_fuzzy_placeholders(filled, data)


def clean_legal_notice(text):

    text = re.sub(r'\*\*', '', text)
    text = re.sub(r'["“”]', '', text)
    return text.strip()


def create_notice(data: dict, tone="formal", selected_type=None, return_ipc = False) -> str | tuple[str, str]:
    """
    Create a legal notice based on the provided data.
    
    Args:
        data (dict): Dictionary containing notice details
        tone (str, optional): Tone of the notice. Defaults to "formal"
        selected_type (str, optional): Type of notice. Defaults to None
        return_ipc (bool, optional): Whether to return IPC sections. Defaults to False
        
    Returns:
        Union[str, Tuple[str, str]]: Either the notice text, or a tuple of (ipc_sections, notice_text)
    """
    if not data.get("incident_description"):
        raise ValueError("incident_description is required in data")
        
    ipc_sections = recommend_ipc_llm(data["incident_description"])
    ipc_section_text = "\n".join(f"- {sec}" for sec in ipc_sections)

    # Print for debugging
    print(f"Creating notice with description: {data['incident_description']}")
    
    prompt = f"""
You are a legal assistant. Based on the following information, generate a complete legal notice in a {tone} tone:

- **Litigation Type**: {selected_type or data.get('notice_type')}
- **Issue Date**: {data.get('issue_date')}
- **Date of Problem**: {data.get('problem_date')}
- **Notice Period**: {data.get('notice_period')}
- **Total Amount**: {data.get('total_amount')}

**Sender Details:**
- Name: {data.get('sender_name')}
- Address: {data.get('sender_address')}
- Title: {data.get('title') or ''}
- Company: {data.get('company') or ''}

**Recipient Details:**
- Name: {data.get('recipient_name')}
- Address: {data.get('recipient_address')}
- Title: {data.get('recipient_title') or ''}
- Company: {data.get('recipient_company') or ''}

**Case Description**:
{data.get('incident_description')}

Sign the notice as:
{data.get('signature')}

The notice should include the headings (first letter capital and other letters lowercase):
- A subject
- Formal opening
- Mention of legal grounds or dispute
- Instructions or demands
- Consequences of not responding
- Signature line

Remove unnecessary Headings, that describe what the notice is about, like "FORMAL OPENING", "MENTION OF LEGAL GROUNDS OR DISPUTE", "INSTRUCTIONS OR DEMANDS", "CONSEQUENCES OF NOT RESPONDING", "SIGNATURE LINE" etc.:

Respond only with the formatted notice.
"""
    notice_text = call_groq(prompt)

    if return_ipc:
        return clean_legal_notice(ipc_section_text), clean_legal_notice(notice_text)

    return clean_legal_notice(notice_text)


from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import tempfile
import os

def generate_pdf_from_text(text: str) -> str:
    """
    Generates a PDF from the given text and returns the file path.
    """
    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    c = canvas.Canvas(temp_pdf.name, pagesize=A4)

    width, height = A4
    x_margin = 40
    y_margin = height - 40
    line_height = 10

    for line in text.split('\n'):
        c.drawString(x_margin, y_margin, line)
        y_margin -= line_height
        if y_margin < 40:  
            c.showPage()
            y_margin = height - 40

    c.save()
    return temp_pdf.name



from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.units import inch

def save_to_pdf(formatted_text, file_path="Legal-Notice.pdf"):
    # Set up the document
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        rightMargin=60,  # 1 inch
        leftMargin=60,   # 1 inch
        topMargin=60,
        bottomMargin=60
    )

    styles = getSampleStyleSheet()
    # Body text style
    body_style = ParagraphStyle(
        name='Body',
        parent=styles['Normal'],
        fontName="Times-Roman",
        fontSize=12,
        leading=16,       # line spacing
        alignment=TA_LEFT,
        spaceAfter=10
    )
    # Heading style (e.g., Subject, Date)
    heading_style = ParagraphStyle(
        name='Heading',
        parent=styles['Normal'],
        fontName="Times-Bold",
        fontSize=12,
        leading=16,
        alignment=TA_LEFT,
        spaceAfter=10
    )

    # Build the content
    story = []

    # Split into paragraphs
    for line in formatted_text.split("\n"):
        line = line.strip()
        if not line:
            story.append(Spacer(1, 12))
            continue
        # Bold for lines starting with known headings
        if line.lower().startswith(("date:", "subject:", "to", "and", "dear", "sincerely", "contact no.", "address:", "name of the company:", "e-mail id:")):
            story.append(Paragraph(line, heading_style))
        else:
            story.append(Paragraph(line, body_style))

    doc.build(story)
    return file_path




import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_notice_email(sender_email, sender_password, recipient_email, subject, notice_text):
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = subject

        msg.attach(MIMEText(notice_text, 'plain'))

        # Use Gmail SMTP as example
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return "✅ Email sent successfully!"
    except Exception as e:
        return f"❌ Email failed: {e}"


import urllib.parse
import webbrowser

def share_notice_whatsapp(phone_number, notice_text):
    try:
        encoded_text = urllib.parse.quote(notice_text)
        url = f"https://wa.me/{phone_number}?text={encoded_text}"
        webbrowser.open(url) 
        return "✅ WhatsApp link opened!"
    except Exception as e:
        return f"❌ WhatsApp sharing failed: {e}"
