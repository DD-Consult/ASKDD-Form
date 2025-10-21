from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import json
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class ContactInfo(BaseModel):
    name: str
    email: EmailStr

class CompanyIdentity(BaseModel):
    legal_name: str
    website: str
    chatbot_display_name: str
    chatbot_persona: Optional[str] = None
    primary_brand_color: str
    secondary_brand_color: str
    accent_color: str
    background_color: Optional[str] = "default"
    chatbot_size: str = "default"

class ChatbotFunctionality(BaseModel):
    business_hours: Optional[str] = None
    out_of_hours_response: Optional[str] = None
    conversation_starters: Optional[List[str]] = None

class KnowledgeBase(BaseModel):
    knowledge_base_description: Optional[str] = None
    csv_format_confirmed: Optional[bool] = False
    core_directive: str = "Option A"
    fallback_message: Optional[str] = None
    other_ai_directives: Optional[str] = None
    support_contact: str

class TechnicalDeployment(BaseModel):
    website_platform: str
    website_management: str
    technical_contact_name: str
    technical_contact_email: EmailStr
    deployment_preference: str

class FormSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    contact_info: ContactInfo
    company_identity: CompanyIdentity
    chatbot_functionality: ChatbotFunctionality
    knowledge_base: KnowledgeBase
    technical_deployment: TechnicalDeployment
    logo_filename: Optional[str] = None
    logo_data: Optional[str] = None
    documents_info: Optional[List[dict]] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FormSubmissionResponse(BaseModel):
    id: str
    contact_info: ContactInfo
    timestamp: datetime

# Email sending function
async def send_email_with_attachments(submission_data: dict, files_data: List[dict]):
    """Send email with form data and file attachments"""
    try:
        smtp_host = os.environ['SMTP_HOST']
        smtp_port = int(os.environ['SMTP_PORT'])
        smtp_email = os.environ['SMTP_EMAIL']
        smtp_password = os.environ['SMTP_PASSWORD']
        recipient_email = os.environ['RECIPIENT_EMAIL']
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = recipient_email
        msg['Subject'] = f"New AI Chatbot Onboarding Form - {submission_data['contact_info']['name']}"
        
        # Create email body
        body = f"""
        New AI Chatbot Onboarding Questionnaire Submission
        
        ========================================
        CONTACT INFORMATION
        ========================================
        Name: {submission_data['contact_info']['name']}
        Email: {submission_data['contact_info']['email']}
        
        ========================================
        COMPANY IDENTITY & BRANDING
        ========================================
        Company Legal Name: {submission_data['company_identity']['legal_name']}
        Company Website: {submission_data['company_identity']['website']}
        Chatbot Display Name: {submission_data['company_identity']['chatbot_display_name']}
        Chatbot Persona & Tone: {submission_data['company_identity'].get('chatbot_persona', 'N/A')}
        Primary Brand Color: {submission_data['company_identity']['primary_brand_color']}
        Secondary Brand Color: {submission_data['company_identity']['secondary_brand_color']}
        Accent Color: {submission_data['company_identity']['accent_color']}
        Background Color: {submission_data['company_identity'].get('background_color', 'default')}
        Chatbot Size: {submission_data['company_identity']['chatbot_size']}
        
        ========================================
        CHATBOT CORE FUNCTIONALITY
        ========================================
        Business Operating Hours: {submission_data['chatbot_functionality'].get('business_hours', 'N/A')}
        Out-of-Hours Response: {submission_data['chatbot_functionality'].get('out_of_hours_response', 'N/A')}
        Conversation Starters: {', '.join(submission_data['chatbot_functionality'].get('conversation_starters', []) or ['N/A'])}
        
        ========================================
        KNOWLEDGE BASE & SYSTEM BEHAVIOR
        ========================================
        Knowledge Base Description: {submission_data['knowledge_base'].get('knowledge_base_description', 'N/A')}
        CSV Format Confirmed: {'Yes' if submission_data['knowledge_base'].get('csv_format_confirmed') else 'No'}
        Chatbot Core Directive: {submission_data['knowledge_base']['core_directive']}
        Fallback Message: {submission_data['knowledge_base'].get('fallback_message', 'N/A')}
        Other AI Directives: {submission_data['knowledge_base'].get('other_ai_directives', 'N/A')}
        Support Contact: {submission_data['knowledge_base']['support_contact']}
        
        ========================================
        TECHNICAL DEPLOYMENT
        ========================================
        Website Platform: {submission_data['technical_deployment']['website_platform']}
        Website Management: {submission_data['technical_deployment']['website_management']}
        Technical Contact Name: {submission_data['technical_deployment']['technical_contact_name']}
        Technical Contact Email: {submission_data['technical_deployment']['technical_contact_email']}
        Deployment Preference: {submission_data['technical_deployment']['deployment_preference']}
        
        ========================================
        Submission Time: {submission_data['timestamp']}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Attach files
        for file_info in files_data:
            if file_info.get('data'):
                part = MIMEBase('application', 'octet-stream')
                file_data = base64.b64decode(file_info['data'])
                part.set_payload(file_data)
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f"attachment; filename={file_info['filename']}")
                msg.attach(part)
        
        # Send email
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(msg)
        server.quit()
        
        logger.info(f"Email sent successfully to {recipient_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@api_router.get("/")
async def root():
    return {"message": "AI Chatbot Onboarding API"}

@api_router.post("/submissions", response_model=FormSubmissionResponse)
async def create_submission(
    contact_info: str = Form(...),
    company_identity: str = Form(...),
    chatbot_functionality: str = Form(...),
    knowledge_base: str = Form(...),
    technical_deployment: str = Form(...),
    logo: Optional[UploadFile] = File(None),
    documents: Optional[List[UploadFile]] = File(None)
):
    """Create a new form submission"""
    try:
        # Parse JSON strings
        contact_data = json.loads(contact_info)
        company_data = json.loads(company_identity)
        chatbot_data = json.loads(chatbot_functionality)
        knowledge_data = json.loads(knowledge_base)
        technical_data = json.loads(technical_deployment)
        
        # Handle logo upload
        logo_filename = None
        logo_data = None
        if logo:
            logo_content = await logo.read()
            logo_filename = logo.filename
            logo_data = base64.b64encode(logo_content).decode('utf-8')
        
        # Handle document uploads
        documents_info = []
        files_data = []
        
        if logo and logo_data:
            files_data.append({
                'filename': logo_filename,
                'data': logo_data,
                'type': 'logo'
            })
        
        if documents:
            for doc in documents:
                doc_content = await doc.read()
                doc_data = base64.b64encode(doc_content).decode('utf-8')
                doc_info = {
                    'filename': doc.filename,
                    'size': len(doc_content),
                    'content_type': doc.content_type
                }
                documents_info.append(doc_info)
                files_data.append({
                    'filename': doc.filename,
                    'data': doc_data,
                    'type': 'document'
                })
        
        # Create submission object
        submission = FormSubmission(
            contact_info=ContactInfo(**contact_data),
            company_identity=CompanyIdentity(**company_data),
            chatbot_functionality=ChatbotFunctionality(**chatbot_data),
            knowledge_base=KnowledgeBase(**knowledge_data),
            technical_deployment=TechnicalDeployment(**technical_data),
            logo_filename=logo_filename,
            logo_data=logo_data,
            documents_info=documents_info
        )
        
        # Convert to dict and serialize
        doc = submission.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        # Save to database
        await db.submissions.insert_one(doc)
        
        # Send email in background
        await send_email_with_attachments(doc, files_data)
        
        return FormSubmissionResponse(
            id=submission.id,
            contact_info=submission.contact_info,
            timestamp=submission.timestamp
        )
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON data: {str(e)}")
    except Exception as e:
        logger.error(f"Error creating submission: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/submissions", response_model=List[FormSubmission])
async def get_submissions():
    """Get all form submissions"""
    try:
        submissions = await db.submissions.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO string timestamps back to datetime
        for submission in submissions:
            if isinstance(submission['timestamp'], str):
                submission['timestamp'] = datetime.fromisoformat(submission['timestamp'])
        
        return submissions
    except Exception as e:
        logger.error(f"Error fetching submissions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/submissions/{submission_id}")
async def get_submission(submission_id: str):
    """Get a specific submission by ID"""
    try:
        submission = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        if isinstance(submission['timestamp'], str):
            submission['timestamp'] = datetime.fromisoformat(submission['timestamp'])
        
        return submission
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching submission: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()