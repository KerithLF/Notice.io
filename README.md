# Legal Notice Generator

A web application that generates legal notices using AI and provides IPC recommendations.

## Project Structure

```
Notice_groq/
├── backend/             # FastAPI backend
│   ├── api.py          # API routes
│   ├── generator.py    # Notice generation logic
│   ├── ipc_indexer.py  # IPC recommendations
│   └── main.py         # Main application
└── frontend/           # React frontend
    ├── src/            # Source code
    └── public/         # Static files
```

## Setup Instructions

### Backend Setup


1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a .env file:
```bash
echo "GROQ_API_KEY=your-api-key-here" > .env
```

5. Start the backend server:
```bash
uvicorn backend.main:app --reload
```

The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/generate-notice` - Generate a legal notice
- `GET /api/litigation-fields/{litigation_type}` - Get fields for a litigation type

## Environment Variables

### Backend
- `GROQ_API_KEY` - Your Groq API key for LLM access

## Development

1. Backend development:
   - API routes are in `backend/api.py`
   - Notice generation logic is in `backend/generator.py`
   - IPC recommendations are in `backend/ipc_indexer.py`

2. Frontend development:
   - Main pages are in `frontend/src/pages`
   - Components are in `frontend/src/components`
   - API calls are in `frontend/src/api`

## Email Configuration

The application supports sending legal notices via email. To configure email:

1. **Test your email configuration:**
   ```bash
   cd backend
   python test_email.py
   ```

2. **For Gmail users:**
   - Enable 2-Factor Authentication
   - Generate an App Password (16 characters)
   - Use the App Password instead of your regular password

3. **For detailed setup instructions:**
   - See `backend/EMAIL_SETUP.md` for comprehensive guide
   - Includes troubleshooting for common email issues

## Troubleshooting

1. If you get a "Module not found" error:
   - Make sure you're in the correct directory
   - Ensure the virtual environment is activated
   - Check that all dependencies are installed

2. If the frontend can't connect to the backend:
   - Verify the backend is running on port 8000
   - Check CORS settings in `backend/main.py`
   - Verify API URL in `frontend/src/api/notice.ts`

3. If email sending fails:
   - Run `python test_email.py` to test your configuration
   - Check `backend/EMAIL_SETUP.md` for detailed troubleshooting
   - Ensure you're using the correct password (App Password for Gmail) 