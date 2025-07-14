import os
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
You are a legal expert assistant. Based on the following case description, recommend the most relevant IPC (Indian Penal Code) sections with their section number, title, and a brief description why they apply:

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

The notice should include:
- A subject
- Formal opening
- Mention of legal grounds or dispute
- Instructions or demands
- Consequences of not responding
- Signature line

Respond only with the formatted notice.
"""
    notice_text = call_groq(prompt)

    if return_ipc:
        return ipc_section_text, notice_text

    return notice_text