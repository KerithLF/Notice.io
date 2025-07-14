import gradio as gr
from backend.generator import create_notice
from backend.parsing import extract_text_from_any
from backend.templates import TEMPLATES

def handle_notice(file, selected_type, issue_date, problem_date, case_description, notice_period,
                  total_amount, sender_name, sender_address, sender_title, sender_company,
                  recipient_name, recipient_address, recipient_title, recipient_company,
                  signature, tone):

    if file:
        case_description = extract_text_from_any(file.name)

    data = {
        "notice_type": selected_type,
        "issue_date": issue_date,
        "problem_date": problem_date,
        "incident_description": case_description,
        "notice_period": notice_period,
        "landlord_name": sender_name,
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

    try:
        notice_text, ipc_suggestions = create_notice(data, tone=tone, selected_type=selected_type, return_ipc=True)
        return ipc_suggestions, notice_text
    except Exception as e:
        return "❌ Error", f"❌ Error: {e}"

gr.Interface(
    fn=handle_notice,
    inputs=[
        gr.File(label="Upload Document (Optional)", file_types=[".pdf", ".docx", ".txt", ".jpg", ".png"]),
        gr.Dropdown(choices=list(TEMPLATES.keys()), label="Purpose of Notice / Litigation Type"),
        gr.Textbox(label="Issue Date (YYYY-MM-DD)"),
        gr.Textbox(label="Date of Problem (YYYY-MM-DD)"),
        gr.Textbox(lines=5, label="Case Description (if no file uploaded)"),
        gr.Textbox(label="Notice Period (e.g., 15 days)"),
        gr.Textbox(label="Total Amount (if applicable)"),

        gr.Textbox(label="Sender Name"),
        gr.Textbox(label="Sender Address"),
        gr.Textbox(label="Sender Title (optional)"),
        gr.Textbox(label="Sender Company (optional)"),

        gr.Textbox(label="Recipient Name"),
        gr.Textbox(label="Recipient Address"),
        gr.Textbox(label="Recipient Title (optional)"),
        gr.Textbox(label="Recipient Company (optional)"),

        gr.Textbox(label="Signature (Sender’s Name or Designated Signatory)"),
        gr.Radio(choices=["formal", "casual", "firm", "empathetic"], label="Tone", value="formal")
    ],
    outputs=[
        gr.Textbox(lines=30, label="📝 Generated Legal Notice"),
        gr.Textbox(lines=5, label="📚 Recommended IPC Sections")
    ],
    title="📝 Notice.io - AI Legal Notice Generator",
    description="Enter the details to auto-generate a legal notice in your desired tone and template."
).launch()
