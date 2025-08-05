from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime
import tempfile
import os
import time
from fastapi.responses import FileResponse

from backend.generator import generate_legal_notice, get_recommendations, save_to_pdf, send_notice_email, share_notice_whatsapp
from backend.ipc_indexer import IPCRetriever, get_ipc_recommendations
from backend.ipc_indexer import SemanticEmbedder, load_ipc_data

router = APIRouter()

# --------------------- Models ---------------------

class Incident(BaseModel):
    date: str
    description: str

class Recipient(BaseModel):
    recipient_name: str
    recipientFather_name: Optional[str] = None
    recipient_address: str
    recipient_mail: str
    recipient_phone: str

class NoticeRequest(BaseModel):
    litigation_type: str
    sub_litigation_type: Optional[str] = None
    tone: str
    subject: str
    issue_date: str
    sender_name: str
    senderFather_name: Optional[str] = None
    sender_address: str
    sender_mail: str
    sender_phone: str
    council_name: str
    council_address: str
    council_mail: str
    council_phone: str
    contributor_name: str
    contributor_address: str
    contributor_mail: str
    contributor_phone: str
    recipients: List[Recipient]
    incidents: List[Incident]
    conclusion: str
    custom_fields: Optional[dict] = {}

class IPCRecommendation(BaseModel):
    section: str
    title: str
    description: str

class NoticeResponse(BaseModel):
    notice_text: str
    ipc_recommendations: List[IPCRecommendation]

class IPCRequestFlexible(BaseModel):
    subject: str
    incidents: List[Union[str, Incident]]

class DownloadPDFRequest(BaseModel):
    notice_text: str

class EmailRequest(BaseModel):
    sender_email: str
    sender_password: str
    recipient_email: str
    subject: str
    notice_text: str

class WhatsAppRequest(BaseModel):
    phone_number: str
    notice_text: str

# --------------------- Routes ---------------------

@router.post("/ipc-recommendations", response_model=List[IPCRecommendation])
async def ipc_recommendations(request: IPCRequestFlexible):
    try:
        print("Received request for IPC recommendations")

        # Normalize incidents
        normalized = [
            i if isinstance(i, str) else i.description for i in request.incidents
        ]

        embedder = SemanticEmbedder()
        df = load_ipc_data("ipc_sect1ons.csv")
        retriever = IPCRetriever(embedder, df)
        results = retriever.recommend(query=" ".join([request.subject] + normalized), top_k=5)

        return [
            get_ipc_recommendations(
                section=str(row['Sections']),
                title=row.get('Acts', 'IPC'),
                description=str(),
                Keywords=row.get('Keywords', '')
            )
            for _, row in results.iterrows()
        ]
    except Exception as e:
        print(f"Error in ipc_recommendations endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-notice", response_model=NoticeResponse)
async def generate_notice(request: NoticeRequest):
    try:
        print("Received request for notice generation")

        recipient = request.recipients[0] if request.recipients else Recipient(
            recipient_name="",
            recipientFather_name="",
            recipient_address="",
            recipient_mail="",
            recipient_phone=""
        )

        # Generate notice text
        notice_text = generate_legal_notice(
            litigation_type=request.litigation_type,
            sub_type=request.sub_litigation_type or "",
            tone=request.tone,
            subject=request.subject,
            issue_date=request.issue_date,
            sender_details={
                "name": request.sender_name,
                "father_name": request.senderFather_name or "",
                "address": request.sender_address,
                "email": request.sender_mail,
                "phone": request.sender_phone
            },
            recipient_details={
                "name": recipient.recipient_name,
                "father_name": recipient.recipientFather_name or "",
                "address": recipient.recipient_address,
                "email": recipient.recipient_mail,
                "phone": recipient.recipient_phone
            },
            council_details={
                "name": request.council_name,
                "address": request.council_address,
                "email": request.council_mail,
                "phone": request.council_phone
            },
            contributor_details={
                "name": request.contributor_name,
                "address": request.contributor_address,
                "email": request.contributor_mail,
                "phone": request.contributor_phone
            },
            incidents=[{
                "date": incident.date,
                "description": incident.description
            } for incident in request.incidents],
            conclusion=request.conclusion
        )

        print("Notice generated successfully")

        # IPC Recommendations
        print("Getting IPC recommendations")
        embedder = SemanticEmbedder()
        df = load_ipc_data("ipc_sect1ons.csv")
        retriever = IPCRetriever(embedder, df)

        # Build query text and filter out empty strings
        incident_descriptions = [i.description for i in request.incidents if i.description.strip()]
        query_text = " ".join(filter(None, [request.subject] + incident_descriptions))

        # Only get recommendations if we have some text to query
        if query_text.strip():
            ipc_results = retriever.recommend(query=query_text) #top_k=5)
            ipc_recommendations = [
                get_recommendations(
                    section=str(row['Sections']),
                    title=row.get('Acts', 'IPC'), 
                    description=row.get('Keywords','')
                )
                for _, row in ipc_results.iterrows()
            ]
        else:
            ipc_recommendations = []  # Return empty list if no valid query text

        print("IPC recommendations generated successfully")

        return NoticeResponse(
            notice_text=notice_text,
            ipc_recommendations=ipc_recommendations
        )

    except Exception as e:
        print(f"Error in generate_notice endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/litigation-fields/{litigation_type}")
async def get_litigation_fields(litigation_type: str):
    try:
        print(f"Getting fields for litigation type: {litigation_type}")
        fields = {
            "Employment Law": [
                {"name": "employee_name", "label": "Employee Name"},
                {"name": "employer_name", "label": "Employer Name"},
                {"name": "employment_start", "label": "Employment Start Date"},
                {"name": "employment_end", "label": "Employment End Date"}
            ],
            "Civil": [
                {"name": "plaintiff_name", "label": "Plaintiff Name"},
                {"name": "defendant_name", "label": "Defendant Name"},
                {"name": "claim_amount", "label": "Claim Amount"}
            ],
            "Criminal": [
                {"name": "complainant_name", "label": "Complainant Name"},
                {"name": "accused_name", "label": "Accused Name"},
                {"name": "police_station", "label": "Police Station"},
                {"name": "fir_number", "label": "FIR Number"}
            ],
            "Property": [
                {"name": "property_address", "label": "Property Address"},
                {"name": "property_type", "label": "Property Type"},
                {"name": "dispute_type", "label": "Dispute Type"}
            ]
        }

        return fields.get(litigation_type, [])
    except Exception as e:
        print(f"Error in get_litigation_fields endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def cleanup_temp_file(file_path: str, delay: int = 60):
    """Clean up temporary file after delay"""
    time.sleep(delay)
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
            print(f"Cleaned up temporary file: {file_path}")
    except Exception as e:
        print(f"Error cleaning up file {file_path}: {e}")

@router.post("/download-pdf")
async def download_pdf(request: DownloadPDFRequest, background_tasks: BackgroundTasks):
    temp_file = None
    try:
        print("Received request for PDF download")

        # Create a temporary file for the PDF
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp_file.close()

        # Generate the PDF
        pdf_path = save_to_pdf(request.notice_text, temp_file.name)

        # Schedule cleanup after 60 seconds
        background_tasks.add_task(cleanup_temp_file, pdf_path, 60)

        # Return the file as a response
        return FileResponse(
            path=pdf_path,
            filename="Legal-Notice.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        print(f"Error in download_pdf endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-email")
async def send_email(request: EmailRequest):
    try:
        print("Received request for email sending")
        result = send_notice_email(
            sender_email=request.sender_email,
            sender_password=request.sender_password,
            recipient_email=request.recipient_email,
            subject=request.subject,
            notice_text=request.notice_text
        )
        return {"message": result}
    except Exception as e:
        error_message = str(e)
        print(f"Error in send_email endpoint: {error_message}")
        
        # Provide more helpful error messages
        if "Authentication failed" in error_message:
            raise HTTPException(
                status_code=401, 
                detail={
                    "error": "Email authentication failed",
                    "message": error_message,
                    "help": "Run 'python email_help.py' for immediate assistance or see EMAIL_SETUP.md for detailed instructions"
                }
            )
        else:
            raise HTTPException(status_code=500, detail=str(e))


@router.post("/share-whatsapp")
async def share_whatsapp(request: WhatsAppRequest):
    try:
        print("Received request for WhatsApp sharing")
        result = share_notice_whatsapp(
            phone_number=request.phone_number,
            notice_text=request.notice_text
        )
        return {"message": result}
    except Exception as e:
        print(f"Error in share_whatsapp endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
