import os
import re
from typing import Optional

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from google import genai
from dotenv import load_dotenv

from prompts import create_email_prompt

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

app = FastAPI(title="Missive - AI Email Generator")

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

FALLBACK_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.7-flash"]


def parse_email_response(text: str):
    """Separate subject line from the body if present."""
    if not text:
        return "", ""
    
    # Strip markdown backticks if returned by model
    clean_text = re.sub(r"^```[a-zA-Z]*\n?", "", text.strip())
    clean_text = re.sub(r"\n?```$", "", clean_text).strip()
    
    subject = ""
    body = clean_text
    
    subject_match = re.search(r"^Subject:\s*(.*?)$", clean_text, re.MULTILINE | re.IGNORECASE)
    if subject_match:
        subject = subject_match.group(1).strip()
        # Remove the Subject line from the body
        body = re.sub(r"^Subject:\s*.*?$\n*", "", clean_text, count=1, flags=re.MULTILINE | re.IGNORECASE).strip()
        
    return subject, body


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "email": None,
            "subject": None,
            "body": None,
            "recipient_name": "",
            "sender_name": "",
            "purpose": "",
            "tone": "Professional",
            "length": "Standard",
            "model_choice": os.getenv("GEMINI_MODEL", "gemini-3.6-flash"),
            "used_model": None,
            "error": None
        }
    )


@app.post("/generate", response_class=HTMLResponse)
async def generate_email(
    request: Request,
    recipient_name: str = Form(...),
    purpose: str = Form(...),
    tone: str = Form("Professional"),
    sender_name: Optional[str] = Form(None),
    length: str = Form("Standard"),
    model_choice: Optional[str] = Form(None)
):
    prompt = create_email_prompt(
        recipient_name=recipient_name,
        purpose=purpose,
        tone=tone,
        sender_name=sender_name,
        length=length
    )

    requested_model = model_choice or os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    
    # Clean model string if user passed 'models/...' prefix
    if requested_model.startswith("models/"):
        requested_model = requested_model.replace("models/", "")

    # Build candidates list avoiding duplicates
    candidates = [requested_model]
    for m in FALLBACK_MODELS:
        if m not in candidates:
            candidates.append(m)

    generated_email = None
    used_model = None
    error_msg = None

    for model_name in candidates:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            if response and response.text:
                generated_email = response.text
                used_model = model_name
                error_msg = None  # Clear any previous fallback error message on success
                break
        except Exception as e:
            error_str = str(e)
            error_msg = f"Error generating with '{model_name}': {error_str}"
            continue

    if not generated_email and not error_msg:
        error_msg = "Could not generate email with available Gemini models. Please check your API key or model configuration."

    subject, body = parse_email_response(generated_email) if generated_email else ("", "")

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "email": generated_email,
            "subject": subject,
            "body": body,
            "recipient_name": recipient_name,
            "sender_name": sender_name or "",
            "purpose": purpose,
            "tone": tone,
            "length": length,
            "model_choice": requested_model,
            "used_model": used_model,
            "error": error_msg if not generated_email else None
        }
    )