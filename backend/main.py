from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.generator import create_notice, generate_pdf_from_text, save_to_pdf, send_notice_email, share_notice_whatsapp
from backend.parsing import extract_text_from_any
from backend.templates import TEMPLATES, LITIGATION_FIELDS
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/generate-notice', methods=['POST'])
def generate_notice():
    try:
        data = request.json
        notice_text, ipc_suggestions = create_notice(data, tone=data.get('tone', 'formal'), 
                                                   selected_type=data.get('selected_type'), 
                                                   return_ipc=True)
        return jsonify({
            'notice': notice_text,
            'ipc': ipc_suggestions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/litigation-fields/<litigation_type>')
def get_litigation_fields(litigation_type):
    if litigation_type in LITIGATION_FIELDS:
        return jsonify(LITIGATION_FIELDS[litigation_type])
    return jsonify([])

@app.route('/templates')
def get_templates():
    return jsonify({'templates': list(TEMPLATES.keys())})

@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    try:
        notice_text = request.json.get('notice_text')
        if not notice_text:
            return jsonify({'error': 'Notice text is required'}), 400
            
        pdf_path = save_to_pdf(notice_text)
        return jsonify({'pdf_path': pdf_path})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        result = send_notice_email(
            data['sender_email'],
            data['sender_password'],
            data['recipient_email'],
            "Legal Notice",
            data['notice_text']
        )
        return jsonify({'message': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/share-whatsapp', methods=['POST'])
def share_whatsapp():
    try:
        data = request.json
        result = share_notice_whatsapp(
            data['phone_number'],
            data['notice_text']
        )
        return jsonify({'message': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8000)
