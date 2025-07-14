import gradio as gr
from backend.generator import create_notice, generate_pdf_from_text, save_to_pdf
from backend.parsing import extract_text_from_any
from backend.templates import TEMPLATES
import tempfile

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



def handle_pdf_download(edited_notice_text):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            pdf_path = temp_pdf.name
        from backend.generator import save_to_pdf
        save_to_pdf(edited_notice_text, pdf_path)
        return pdf_path
    except Exception as e:
        return f"❌ Failed to generate PDF: {e}"


with gr.Blocks() as demo:
    with gr.Row():
        with gr.Column():
            file_input = gr.File(label="Upload Document", file_types=[".pdf", ".docx", ".txt", ".jpg", ".png"])
            type_input = gr.Dropdown(choices=list(TEMPLATES.keys()), label="Purpose of Notice / Litigation Type")
            tone_input = gr.Radio(choices=["formal", "casual", "firm", "empathetic"], label="Tone", value="formal")
            issue_date = gr.Textbox(label="Issue Date (YYYY-MM-DD)")
            problem_date = gr.Textbox(label="Date of Problem (YYYY-MM-DD)")
            case_desc = gr.Textbox(lines=5, label="Case Description (if no file uploaded)")
            notice_period = gr.Textbox(label="Notice Period")
            total_amount = gr.Textbox(label="Total Amount (if applicable)")
            sender_name = gr.Textbox(label="Sender Name")
            sender_address = gr.Textbox(label="Sender Address")
            sender_title = gr.Textbox(label="Sender Title (optional)")
            sender_company = gr.Textbox(label="Sender Company (optional)")
            recipient_name = gr.Textbox(label="Recipient Name")
            recipient_address = gr.Textbox(label="Recipient Address")
            recipient_title = gr.Textbox(label="Recipient Title (optional)")
            recipient_company = gr.Textbox(label="Recipient Company (optional)")
            signature = gr.Textbox(label="Signature")

            generate_button = gr.Button("Generate Legal Notice")

        with gr.Column():
            notice_output = gr.Textbox(label="⚖️ Recommended IPC Sections", lines=10)
            ipc_output = gr.TextArea(label="📝 Generated Legal Notice (Editable)", lines=50, max_lines=None, interactive=True)
            download_button = gr.Button("⬇️ Download as PDF")
            download_file = gr.File(label="📄 Click to Download PDF")

    generate_button.click(
        fn=handle_notice,
        inputs=[file_input, type_input, issue_date, problem_date, case_desc, notice_period,
                total_amount, sender_name, sender_address, sender_title, sender_company,
                recipient_name, recipient_address, recipient_title, recipient_company,
                signature, tone_input],
        outputs=[ipc_output, notice_output]
    )

    download_button.click(
        fn=handle_pdf_download,
        inputs=[ipc_output],
        outputs=[download_file]
    )

demo.launch()
