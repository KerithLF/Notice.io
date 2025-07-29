from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime
from backend.generator import generate_legal_notice
from backend.ipc_indexer import get_ipc_recommendations

router = APIRouter()


class Incident(BaseModel):
    date: str
    description: str

class NoticeRequest(BaseModel):
    litigation_type: str
    sub_litigation_type: str
    tone: str
    subject: str
    issue_date: str
    sender_name: str
    senderFather_name: Optional[str] = None
    sender_address: str
    sender_mail: str
    sender_phone: str
    recipient_name: str
    recipientFather_name: Optional[str] = None
    recipient_address: str
    recipient_mail: str
    recipient_phone: str
    council_name: str
    council_address: str
    council_mail: str
    council_phone: str
    incidents: List[Incident]
    conclusion: str

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

@router.post("/ipc-recommendations", response_model=List[IPCRecommendation])
async def ipc_recommendations(request: IPCRequestFlexible):
    try:
        print("Received request for IPC recommendations")
        # Convert Incident objects to plain strings
        normalized = [
            i if isinstance(i, str) else i.description for i in request.incidents
        ]
        return get_ipc_recommendations(subject=request.subject)
    except Exception as e:
        print(f"Error in ipc_recommendations endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-notice", response_model=NoticeResponse)
async def generate_notice(request: NoticeRequest):
    try:
        print("Received request for notice generation")
        # Generate the notice text using the LLM
        notice_text = generate_legal_notice(
            litigation_type=request.litigation_type,
            sub_type=request.sub_litigation_type,
            tone=request.tone,
            subject=request.subject,
            issue_date=request.issue_date,
            sender_details={
                "name": request.sender_name,
                "father_name": request.senderFather_name,
                "address": request.sender_address,
                "email": request.sender_mail,
                "phone": request.sender_phone
            },
            recipient_details={
                "name": request.recipient_name,
                "father_name": request.recipientFather_name,
                "address": request.recipient_address,
                "email": request.recipient_mail,
                "phone": request.recipient_phone
            },
            council_details={
                "name": request.council_name,
                "address": request.council_address,
                "email": request.council_mail,
                "phone": request.council_phone
            },
            incidents=[{
                "date": incident.date,
                "description": incident.description
            } for incident in request.incidents],
            conclusion=request.conclusion
        )
        print("Notice generated successfully")

        # Get IPC recommendations based on subject and incidents
        incident_texts = [incident.description for incident in request.incidents]
        print("Getting IPC recommendations")
        ipc_recommendations = get_ipc_recommendations(
            subject=request.subject,
            incidents=incident_texts
        )
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
        # Define dynamic fields based on litigation type
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
        
        result = fields.get(litigation_type, [])
        print(f"Returning fields: {result}")
        return result
    except Exception as e:
        print(f"Error in get_litigation_fields endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))