def create_email_prompt(recipient_name, purpose, tone, sender_name=None, length="Standard"):
    sender_str = f"Sender Name: {sender_name}\n" if sender_name else "Sender Name: [Your Name]\n"
    
    length_instruction = {
        "Concise": "Keep the email short, direct, and under 100 words.",
        "Standard": "Write a balanced email of typical length (100-200 words).",
        "Detailed": "Write a thorough, detailed email with full context and explanations (200+ words)."
    }.get(length, "Write a balanced email of typical length.")

    prompt = f"""
You are an expert AI email drafting assistant.

Write a complete, professional email based on the details below:

Recipient Name: {recipient_name}
{sender_str}
Email Purpose: {purpose}
Requested Tone: {tone}
Length Guidance: {length_instruction}

Requirements:
- Provide an engaging, relevant Subject line at the very top starting with 'Subject: '.
- Start with a clear and appropriate greeting.
- Effectively communicate the email purpose with clarity and correct context.
- Adhere strictly to the requested tone ({tone}).
- Follow the length instruction ({length_instruction}).
- Close with a professional sign-off using the sender name provided (or '[Your Name]' if unspecified).
- Do not output any preamble, commentary, explanations, or markdown code block quotes around the email.
- Output ONLY the email content.

Output Format Example:
Subject: [Clear & Compelling Subject Line]

Dear [Recipient],

[Email body content formatted into clear paragraphs]

Best regards,
{sender_name if sender_name else '[Your Name]'}
"""

    return prompt.strip()