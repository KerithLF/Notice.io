from fastapi import FastAPI, UploadFile, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.generator import create_notice, save_to_pdf, recommend_ipc_llm
from backend.parsing import extract_text_from_any
from backend.templates import TEMPLATES, LITIGATION_FIELDS
import tempfile

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only. Restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-notice/")
async def generate_notice(
    selected_type: str = Form(...),
    issue_date: str = Form(...),
    problem_date: str = Form(...),
    case_description: str = Form(...),  # Make sure this is required
    notice_period: str = Form(...),
    total_amount: str = Form(""),
    sender_name: str = Form(...),
    sender_address: str = Form(...),
    sender_title: str = Form(""),
    sender_company: str = Form(""),
    recipient_name: str = Form(...),
    recipient_address: str = Form(...),
    recipient_title: str = Form(""),
    recipient_company: str = Form(""),
    signature: str = Form(...),
    tone: str = Form(...),
    file: UploadFile = None
):
    if file:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            case_description = extract_text_from_any(tmp.name)
    
    # Print for debugging
    print(f"Case Description: {case_description}")
    
    data = {
        "notice_type": selected_type,
        "issue_date": issue_date,
        "problem_date": problem_date,
        "incident_description": case_description,  # Make sure this is set correctly
        "notice_period": notice_period,
        "sender_name": sender_name,
        "sender_address": sender_address,
        "title": sender_title,
        "company": sender_company or "",
        "signature": signature,
        "total_amount": total_amount or "",
        "recipient_name": recipient_name,
        "recipient_address": recipient_address,
        "recipient_title": recipient_title or "",
        "recipient_company": recipient_company or "",
    }
    
    # Print for debugging
    print(f"Data being sent to create_notice: {data}")
    
    ipc, notice = create_notice(data, tone=tone, selected_type=selected_type, return_ipc=True)
    return {"ipc": ipc, "notice": notice}

@app.get("/templates/")
def get_templates():
    return {"templates": list(TEMPLATES.keys())}

@app.get("/litigation-fields/{template_name}")
def get_fields(template_name: str):
    return {"fields": LITIGATION_FIELDS.get(template_name, [])}

@app.get("/ipc-recommendations")
def ipc_recommendations(subject: str = Query(...)):
    # Use your LLM-based function for recommendations
    ipc_sections = recommend_ipc_llm(subject)
    # Clean up and return as a list
    cleaned = [sec.strip("- ").strip() for sec in ipc_sections if sec.strip()]
    return {"recommendations": cleaned}