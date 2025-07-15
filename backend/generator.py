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
- Eviction
- Payment Recovery
- Employment Termination
- Contract Breach
- Loan Default
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


def create_notice(data: dict, tone="formal", selected_type=None, return_ipc = False) -> str:

    ipc_sections = recommend_ipc_llm(data.get("incident_description"))
    ipc_section_text = "\n".join(f"- {sec}" for sec in ipc_sections)

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

Remove unnecessary Headings, that describe what the notice is about, like "FORMAL OPENING", "MENTION OF LEGAL GROUNDS OR DISPUTE", "INSTRUCTIONS OR DEMANDS", "CONSEQUENCES OF NOT RESPONDING", "SIGNATURE LINE" etc.
in this format:

                                    LEGAL NOTICE

 Subject: Demand for Return of Security Deposit and Notice of Intention to File Suit
 Date: 2025-07-13
 To:
 Mr. Suresh
 S/o [Insert Father's Name]
 Address: Raidurg
 Space Unit No. [Insert Unit Number] on [Insert Building Name] at [Insert Address]

 Dear Mr. Suresh,

 We, Google, through its Director Mr. Ramesh, were formerly your tenant at Space Unit No.
 [Insert Unit Number] on [Insert Building Name] at [Insert Address] (hereinafter referred to as
 Premises) which we vacated from [Insert Date] pursuant to and recorded with our lease dated
 [Insert Date]. Unfortunately, we have not yet received the return of our security deposit in the
 amount of Rs. 380,000/- (Rupees Three Hundred Eighty Thousand Only) for that rental
 premises.

 You, as the landlord, are required to return to us, as the tenant, simultaneously on the same
 day (i.e. [Insert Date]) the following:
 1. Our full security deposit: Rs. 380,000/- (Rupees Three Hundred Eighty Thousand Only)
 2. All of the tenant/lessee obligations in relation to this property have been fulfilled. In
 particular, no damage has been caused to the property and there is no outstanding rent. All
 conditions for refund of the security deposit have been fulfilled.

 Please send the cheque payable to us, in amount of Rs. 380,000/- (Rupees Three Hundred
 Eighty Thousand Only) to our address listed above within 10 days of your receipt of this letter.

 If you fail to comply with this demand, we will have no choice but to file suit for the recovery of
 the security deposit, plus trouble damages, court costs, and lawyer's fees.

 If you have any questions regarding this letter, please do not hesitate to contact us at:

 Name of the Company: Google
 Address: Madhapur
 Contact No.: [Insert Contact Number]
 E-mail Id: [Insert Email Id]

Thank you for your prompt attention to this matter.

 Sincerely,
 Ramesh
 Director, Google

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
    x_margin = 50
    y_margin = height - 50
    line_height = 15

    for line in text.split('\n'):
        c.drawString(x_margin, y_margin, line)
        y_margin -= line_height
        if y_margin < 50:  
            c.showPage()
            y_margin = height - 50

    c.save()
    return temp_pdf.name


from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch

def save_to_pdf(text, file_path="generated_notice.pdf"):
    doc = SimpleDocTemplate(file_path, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    
    base_styles = getSampleStyleSheet()
    
 
    custom_style = ParagraphStyle(
        name='CustomStyle',
        parent=base_styles['Normal'],
        fontSize=12,
        leading=16, 
        spaceAfter=12
    )

    story = []
    for line in text.split("\n"):
        if line.strip(): 
            story.append(Paragraph(line.strip(), custom_style))
        else:
            story.append(Spacer(1, 12))

    doc.build(story)


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
