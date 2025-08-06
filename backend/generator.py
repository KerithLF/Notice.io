import os
import re
from zipfile import Path
import requests
from sentence_transformers import util
from dotenv import load_dotenv
from backend.templates import TEMPLATES, PLACEHOLDER_ALIASES
from backend.utils import normalize_fuzzy_placeholders
from backend.ipc_indexer import get_ipc_sections
from typing import List, Dict

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



# def classify_notice_type(description: str) -> str:
#     prompt = f"""
# You are a legal assistant. Classify the notice type for the following case:

# \"\"\"{description}\"\"\"

# Choose from:
# - Payment Recovery
# - Employment Termination
# - Contract Breach
# - Loan Default
# - Eviction Notice
# - Loan Default Notice
# - Cheque Bounce / Dishonour of Cheque Notice
# - Consumer Complaint Notice
# - Defamation / Harassment Notice
# - Lease Termination Notice
# - Legal Demand Notice (General)
# """
#     return call_groq(prompt)



# def summarize_incident(description: str, tone="formal") -> str:
#     prompt = f"""

# You are a highly skilled legal assistant specializing in drafting formal legal notices on behalf of clients, following standard Indian legal practices. 

# Using the rules below, generate a complete, professionally worded legal notice in plain English, unless otherwise specified:

# RULES AND STRUCTURE TO FOLLOW:

# 1. Start the notice on a lawyer’s letterhead (just mention: "[On the letterhead of <Lawyer’s Name>]").
# 2. Center-align the modes of service (e.g., "By Registered Post A/D", "By Email") at the top.
# 3. On the top-right corner, mention the date of issuing the notice.
# 4. After that, clearly mention the recipient details:
#    - Name of recipient
#    - Father’s/Husband’s name
#    - Full address with pin code
#    - Contact details if available (phone/email)
#    - If multiple recipients, list them with numbers and write “also at:” for their additional addresses if any.
# 5. Include a subject line: "Subject: Legal Notice"
# 6. In the body, first mention the sender’s details (name, parent’s/husband’s name, full address, pin code, contact details).
#    - If a lawyer is sending on behalf of someone, refer to the sender as “my client.”
# 7. Introduce the sender and recipient and their relationship/acquaintance.
# 8. Describe clearly and chronologically the events that led to the dispute.
# 9. Refer to the recipient(s) as “the addressee” or “addressee no.1” etc. depending on number of recipients.
# 10. Mention the specific laws or provisions relied upon by the sender for claiming remedy.
# 11. Clearly state the instructions to the recipient and specify the exact time limit within which they must comply or respond.
# 12. Warn that failure to comply within the allotted time will lead to appropriate legal proceedings without further notice.
# 13. Mention that a copy of the legal notice is retained for records and possible future legal action.
# 14. End with the closing salutation and the sender’s signature.

# TONE AND STYLE:
# - Generate a legal notice following the above rules for the given incident in a {tone} legal tone.
# - Avoid ambiguity.
# - Follow proper legal formatting conventions.

# INPUT DATA:
# - Sender details: {{sender_details}}
# - Recipient details: {{recipient_details}}
# - Event description: {{event_description}}
# - Applicable laws/acts: {{applicable_laws}}
# - Time limit for response: {{time_limit}}

# OUTPUT:
# A fully drafted legal notice following the above rules, ready to be printed and sent.

# Now, using the above information and structure, draft the perfect legal notice.


# \"\"\"{description}\"\"\"
# """
#     return call_groq(prompt)



# def recommend_ipc_llm(description: str) -> list:
#     ipc_context = "\n\n".join(get_ipc_sections(description))
#     prompt = f"""
# You are a legal expert assistant. Based on the following case description and subject, recommend the most relevant IPC (Indian Penal Code) sections with their section number, title, and a brief description why they apply from the {ipc_context} with respected keywords, so that the user can easily find the relevant section:

# Case Description:
# ""{description}""

# Respond in this format:
# - Section 420: Cheating
#          Explanation:
#          keywords:
#          - cheating
#          - fraud
#          - dishonesty
#          - deceit
#          - misrepresentation
#          - breach of trust
# - Section 448: House Trespass
#          Explanation:
#          keywords:
#          - trespass
#          - house
#          - breach
#          - violation
#          - trespass
#          - house
# - ...
# """

#     response = call_groq(prompt)
#     return response.strip().split("\\n")


def fill_notice_template(notice_type: str, data: dict, summarized_body: str) -> str:
    template = TEMPLATES.get(notice_type)
    if not template:
        raise ValueError(f"No template for notice type: {notice_type}")

    filled = template.format(
        issue_date=data.get("issue_date", ""),
        problem_date=data.get("problem_date", ""),
        recipient_name=data.get("recipient_name", ""),
        recipient_father_name=data.get("recipientFather_name", ""),
        recipient_address=data.get("recipient_address", ""),
        subject=data.get("subject", "Regarding your legal obligation"),
        total_amount=data.get("total_amount", ""),
        sender_name=data.get("sender_name", ""),
        sender_father_name=data.get("senderFather_name", ""),
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


# def create_notice(data: dict, tone="formal", selected_type=None, return_ipc = False) -> str | tuple[str, str]:
#     """
#     Create a legal notice based on the provided data.
    
#     Args:
#         data (dict): Dictionary containing notice details
#         tone (str, optional): Tone of the notice. Defaults to "formal"
#         selected_type (str, optional): Type of notice. Defaults to None
#         return_ipc (bool, optional): Whether to return IPC sections. Defaults to False
        
#     Returns:
#         Union[str, Tuple[str, str]]: Either the notice text, or a tuple of (ipc_sections, notice_text)
#     """
#     if not data.get("incident_description"):
#         raise ValueError("incident_description is required in data")
        
#     ipc_sections = recommend_ipc_llm(data["incident_description"])
#     ipc_section_text = "\n".join(f"- {sec}" for sec in ipc_sections)

#     # Print for debugging
#     print(f"Creating notice with description: {data['incident_description']}")
    
#     prompt = f"""
# You are a highly skilled legal assistant specializing in drafting formal legal notices on behalf of clients, following standard Indian legal practices. 

# Using the rules below, generate a complete legal notice in a {tone} tone, professionally worded legal notice in plain English, unless otherwise specified:

# - **Litigation Type**: {selected_type or data.get('notice_type')}
# - **Issue Date**: {data.get('issue_date')}
# - **Date of Problem**: {data.get('problem_date')}
# - **Notice Period**: {data.get('notice_period')}
# - **Total Amount**: {data.get('total_amount')}

# **Sender Details:**
# - Name: {data.get('sender_name')}
# - Father's Name: {data.get('senderFather_name')}
# - Address: {data.get('sender_address')}
# - Title: {data.get('title') or ''}
# - Company: {data.get('company') or ''}

# **Recipient Details:**
# - Name: {data.get('recipient_name')}
# - Father's Name: {data.get('recipientFather_name')}
# - Address: {data.get('recipient_address')}
# - Title: {data.get('recipient_title') or ''}
# - Company: {data.get('recipient_company') or ''}

# **Case Description**:
# {data.get('incident_description')}

# Sign the notice as:
# {data.get('signature')}

# RULES AND STRUCTURE TO FOLLOW:

# 1. Start the notice on a lawyer’s letterhead (just mention: "[On the letterhead of <Lawyer’s Name>]").
# 2. Center-align the modes of service (e.g., "By Registered Post A/D", "By Email") at the top.
# 3. On the top-right corner, mention the date of issuing the notice.
# 4. After that, clearly mention the recipient details:
#    - Name of recipient
#    - Father’s/Husband’s name
#    - Full address with pin code
#    - Contact details if available (phone/email)
#    - If multiple recipients, list them with numbers and write “also at:” for their additional addresses if any.
# 5. Include a subject line: "Subject: Legal Notice"
# 6. In the body, first mention the sender’s details (name, parent’s/husband’s name, full address, pin code, contact details).
#    - If a lawyer is sending on behalf of someone, refer to the sender as “my client.”
# 7. Introduce the sender and recipient and their relationship/acquaintance.
# 8. Describe clearly and chronologically the events that led to the dispute.
# 9. Refer to the recipient(s) as “the addressee” or “addressee no.1” etc. depending on number of recipients.
# 10. Mention the specific laws or provisions relied upon by the sender for claiming remedy.
# 11. Clearly state the instructions to the recipient and specify the exact time limit within which they must comply or respond.
# 12. Warn that failure to comply within the allotted time will lead to appropriate legal proceedings without further notice.
# 13. Mention that a copy of the legal notice is retained for records and possible future legal action.
# 14. End with the closing salutation and the sender’s signature.

# TONE AND STYLE:
# - Be formal, precise, and professional.
# - Avoid ambiguity.
# - Follow proper legal formatting conventions.

# INPUT DATA:
# - Sender details: {{sender_details}}
# - Recipient details: {{recipient_details}}
# - Event description: {{event_description}}
# - Applicable laws/acts: {{applicable_laws}}
# - Time limit for response: {{time_limit}}

# OUTPUT:
# A fully drafted legal notice following the above rules, ready to be printed and sent.

# Now, using the above information and structure, draft the perfect legal notice.


# Remove unnecessary Headings, that describe what the notice is about, like "FORMAL OPENING", "MENTION OF LEGAL GROUNDS OR DISPUTE", "INSTRUCTIONS OR DEMANDS", "CONSEQUENCES OF NOT RESPONDING", "SIGNATURE LINE" etc.:

# Respond only with the formatted notice.
# """
#     notice_text = call_groq(prompt)

#     if return_ipc:
#         return clean_legal_notice(ipc_section_text), clean_legal_notice(notice_text)

#     return clean_legal_notice(notice_text)


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
    x_margin = 30
    y_margin = height - 30
    line_height = 10

    for line in text.split('\n'):
        c.drawString(x_margin, y_margin, line)
        y_margin -= line_height
        if y_margin < 30:  
            c.showPage()
            y_margin = height - 30

    c.save()
    return temp_pdf.name



from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.units import inch

def save_to_pdf(formatted_text, file_path="Legal-Notice.pdf"):
    try:
        # Set up the document
        doc = SimpleDocTemplate(
            file_path,
            pagesize=A4,
            rightMargin=40,  # 1 inch
            leftMargin=40,   # 1 inch
            topMargin=40,
            bottomMargin=40
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
    except Exception as e:
        print(f"PDF generation error: {e}")
        raise Exception(f"Failed to generate PDF: {e}")




import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from backend.config import Config

def send_notice_email(sender_email, sender_password, recipient_email, subject, notice_text):
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = subject

        msg.attach(MIMEText(notice_text, 'plain'))

        # Get email configuration based on the email provider
        email_config = Config.get_email_config(sender_email)
        
        # Connect to SMTP server
        if email_config.get('use_ssl', False):
            server = smtplib.SMTP_SSL(email_config['smtp_server'], email_config['smtp_port'])
        else:
            server = smtplib.SMTP(email_config['smtp_server'], email_config['smtp_port'])
            
            if email_config['use_tls']:
                server.starttls()
        
        # Login
        server.login(sender_email, sender_password)
        
        # Send email
        server.send_message(msg)
        server.quit()
        
        return "✅ Email sent successfully!"
        
    except smtplib.SMTPAuthenticationError as e:
        instructions = Config.get_email_instructions(sender_email)
        error_msg = f"""Authentication failed for {sender_email}. 

{instructions}

Error details: {str(e)}"""
        print(f"Email authentication error: {e}")
        raise Exception(error_msg)
        
    except smtplib.SMTPException as e:
        error_msg = f"SMTP error occurred: {e}"
        print(f"SMTP error: {e}")
        raise Exception(error_msg)
        
    except Exception as e:
        error_msg = f"Email failed: {e}"
        print(f"Email error: {e}")
        raise Exception(error_msg)


import urllib.parse
import webbrowser

def share_notice_whatsapp(phone_number, notice_text):
    try:
        # Clean phone number (remove spaces, dashes, etc.)
        clean_phone = ''.join(filter(str.isdigit, phone_number))
        
        # Ensure it starts with country code
        if not clean_phone.startswith('91') and len(clean_phone) == 10:
            clean_phone = '91' + clean_phone
        
        encoded_text = urllib.parse.quote(notice_text)
        url = f"https://wa.me/{clean_phone}?text={encoded_text}"
        
        # Return the URL instead of trying to open browser on server
        return {"url": url, "message": "✅ WhatsApp URL generated successfully!"}
    except Exception as e:
        print(f"WhatsApp error: {e}")
        raise Exception(f"WhatsApp sharing failed: {e}")


def get_incident_date(incident):
    # Frontend uses incident.date as mode: 'full-date' or 'month-year'
    if incident.get('date') == 'full-date' and incident.get('fullDate'):
        return incident['fullDate'].strip()
    elif incident.get('date') == 'month-year' and incident.get('month') and incident.get('year'):
        return f"{incident['month'].strip()}-{incident['year'].strip()}"
    # Fallback: check if any date field has a value
    elif incident.get('fullDate') and incident['fullDate'].strip():
        return incident['fullDate'].strip()
    elif incident.get('month') and incident.get('year') and incident['month'].strip() and incident['year'].strip():
        return f"{incident['month'].strip()}-{incident['year'].strip()}"
    else:
        return ""


def generate_legal_notice(litigation_type: str,sub_type: str,tone: str,subject: str,issue_date: str,sender_details: Dict[str, str],recipient_details: Dict[str, str],council_details: Dict[str, str],contributor_details: Dict[str, str],incidents: List[Dict[str, str]],conclusion: str) -> str:
    try:
        indent = '    '
        # Format incidents with "That on [date]" when date is present
        incidents_str = "\n".join(
            f"{indent}{i+1}. That on {get_incident_date(incident)}, {incident['description']}" if get_incident_date(incident) else f"{indent}{i+1}. That {incident['description']}" for i, incident in enumerate(incidents)
        )
        # Dynamic council/contributor line
        if contributor_details.get('name'):
            council_contributor_line = f"I {contributor_details['name']} on behalf of the {council_details['name']}, under the instructions of Sri.{sender_details['name']}, and duly authorized to give you this notice hereby notify you –"
        else:
            council_contributor_line = f"I {council_details['name']}, under the instructions of Sri.{sender_details['name']}, and duly authorized to give you this notice hereby notify you –"
        # Right-aligned Yours Faithfully (for plain text)
        right_faithfully = ' ' * 64 + 'Yours Faithfully,'
        # Dynamic paragraph numbering after incidents
        para3_num = len(incidents) + 1
        para4_num = len(incidents) + 2
        # Prepare data for template
        data = {
            'sender_name': sender_details['name'],
            'sender_father_name': sender_details.get('father_name', ''),
            'sender_address': sender_details['address'],
            'recipient_name': recipient_details['name'],
            'recipient_father_name': recipient_details.get('father_name', ''),
            'recipient_address': recipient_details['address'],
            'council_name': council_details['name'],
            'contributor_name': contributor_details.get('name', ''),
            'incidents': incidents_str,
            'amount': '',  # Add amount if available in your data
            'issue_date': issue_date,
            'council_contributor_line': council_contributor_line,
            'right_faithfully': right_faithfully,
            'para3_num': para3_num,
            'para4_num': para4_num,
            'indent': indent
        }
        # Use the template
        template = TEMPLATES.get(sub_type) or TEMPLATES.get(litigation_type) or list(TEMPLATES.values())[0]
        notice_text = template.format(**data)
        notice_text = notice_text.strip()
        print("LLM response raw text:", notice_text)

        return clean_legal_notice(notice_text)
    except Exception as e:
        print(f"Error in generate_legal_notice: {str(e)}")
        raise Exception(f"Failed to generate legal notice: {str(e)}")
    

# import pandas as pd

# # Load once globally
# ipc_df = pd.read_csv(r"C:\Users\DELL\Desktop\Notice_groq\ipc_sect1ons.csv").dropna()

# def get_recommendations(litigation_type: str, sub_type: str, subject: str, incidents: list) -> str:
#     # Step 1: Filter by subtype in the 'Keywords' column
#     filtered = ipc_df[ipc_df['Keywords'].str.lower().str.contains(sub_type.lower(), na=False)]

#     if filtered.empty:
#         return f"No relevant legal sections found for subtype: {sub_type}"

#     act_name = filtered['Acts'].iloc[0]

#     # Step 2: Combine subject + incident descriptions
#     incident_text = " ".join(incidents)  # list of incident descriptions
#     query_text = f"{subject.strip()} {incident_text.strip()}"

#     sections_text = "\n".join(
#         f"- {row['Sections']} ({row['Acts']})" for _, row in filtered.iterrows()
#     )

#     prompt = f"""
# You are a legal assistant AI.

# Only consider sections from the following Act for recommendation:
# 📘 {act_name}

# Case Type: {litigation_type}
# Sub-Type: {sub_type}

# Subject:
# {subject}

# Incident Details:
# {incident_text}

# Available Sections:
# {sections_text}

# Instructions:
# - Recommend only the sections from above that apply.
# - For each section, explain why it is applicable.

# Response Format:
# - Section: ...
# - Why Applicable: ...
# """
#     try:
#         response = call_groq(prompt)
#         return response.strip()
#     except Exception as e:
#         return f"Error while generating recommendations: {e}"





def get_recommendations(section: str, title: str, description: str):
    """
    Create an IPC recommendation object from the given parameters.
    This function is used to format IPC recommendations for the API response.
    """
    return {
        "section": section,
        "title": title,
        "description": description
    }



def generate_legal_notice_groq(litigation_type: str,sub_type: str,tone: str,subject: str,issue_date: str,sender_details: Dict[str, str],recipient_details: List[Dict[str, str]],council_details: Dict[str, str],contributor_details: Dict[str, str],incidents: List[Dict[str, str]],conclusion: str) -> str:
    prompt = f"""
You are a legal assistant AI. Below are multiple templates for different types of legal notices.

TEMPLATES:
 {chr(10).join(f"[{key} Template]:\n{value}" for key, value in TEMPLATES.items())}

Case Details:
Litigation Type: {litigation_type}
Sub-Type: {sub_type}
Tone: {tone}
Issue Date: {issue_date}
Subject: {subject}

Sender Details:
Name: {sender_details['name']}
Father's Name: {sender_details.get('father_name', '')}
Address: {sender_details['address']}
Email: {sender_details['email']}
Phone: {sender_details['phone']}

Recipient Details:
Name: {recipient_details['name']}
Father's Name: {recipient_details.get('father_name', '')}
Address: {recipient_details['address']}
Email: {recipient_details['email']}
Phone: {recipient_details['phone']}

Council Details:
Name: {council_details['name']}
Email: {council_details['email']}
Phone: {council_details['phone']}

Contributor Details:
Name: {contributor_details.get('name', '')}

Incidents:
{chr(10).join(f"  - On {incident.get('date', 'Unknown')}: {incident['description']}" for incident in incidents)}

Conclusion:
{conclusion}

Your task is to:
1. Automatically pick the best matching template and don't add a single word other than what is in the selected template and ther are also some logical statements like if else etc so generate accordingly.
2. Replace the placeholders with appropriate values from the case details.
3. Format it as a professional legal notice in {tone} tone.

Respond only with the final notice, ready for PDF generation.
"""

    try:

        response = call_groq(prompt)
        print("LLM response:", response)
        
        if not response or not response.strip():
            raise Exception("No valid text returned from LLM.")

        return response.strip()

    except Exception as e:
        print(f"Error in generate_legal_notice_groq: {e}")
        raise Exception(f"Notice generation failed: {e}")