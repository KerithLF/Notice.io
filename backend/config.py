import os
from typing import Dict, Any

class Config:
    """Configuration class for the application"""
    
    # Email Configuration
    EMAIL_PROVIDERS = {
        'gmail.com': {
            'smtp_server': 'smtp.gmail.com',
            'smtp_port': 587,
            'use_tls': True,
            'use_ssl': False,
            'instructions': """
For Gmail users:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password instead of your regular password
            """
        },
        'outlook.com': {
            'smtp_server': 'smtp-mail.outlook.com',
            'smtp_port': 587,
            'use_tls': True,
            'use_ssl': False,
            'instructions': """
For Outlook/Hotmail users:
- Use your regular email password
- If you have 2FA enabled, you may need to generate an app password
            """
        },
        'hotmail.com': {
            'smtp_server': 'smtp-mail.outlook.com',
            'smtp_port': 587,
            'use_tls': True,
            'use_ssl': False,
            'instructions': """
For Hotmail users:
- Use your regular email password
- If you have 2FA enabled, you may need to generate an app password
            """
        },
        'yahoo.com': {
            'smtp_server': 'smtp.mail.yahoo.com',
            'smtp_port': 587,
            'use_tls': True,
            'use_ssl': False,
            'instructions': """
For Yahoo users:
- You may need to enable "Less secure app access" or use an app password
- Generate an app password if you have 2FA enabled
            """
        },
        'lexfintech.io': {
            'smtp_server': 'smtp.gmail.com',  # Assuming it's using Gmail for business
            'smtp_port': 587,
            'use_tls': True,
            'use_ssl': False,
            'instructions': """
For LexFintech.io (Gmail for Business) users:
1. Enable 2-Factor Authentication on your Google Workspace account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password instead of your regular password
   
Note: If this is a custom email server, contact your IT administrator for SMTP settings.
            """
        }
    }
    
    # Default email provider (fallback)
    DEFAULT_EMAIL_PROVIDER = {
        'smtp_server': 'smtp.gmail.com',
        'smtp_port': 587,
        'use_tls': True,
        'use_ssl': False,
        'instructions': """
For your email provider:
- Check your email and password
- Ensure your email provider allows SMTP access
- Some providers may require enabling "Less secure app access"
- Contact your email provider for SMTP settings

For custom domain emails (like @yourcompany.com):
- Contact your IT administrator for SMTP settings
- Common SMTP servers: smtp.gmail.com, smtp-mail.outlook.com, or your company's mail server
- You may need to use an App Password if using Gmail for Business
        """
    }
    
    @classmethod
    def get_email_config(cls, email: str) -> Dict[str, Any]:
        """Get email configuration for a specific email address"""
        domain = email.split('@')[1].lower()
        return cls.EMAIL_PROVIDERS.get(domain, cls.DEFAULT_EMAIL_PROVIDER)
    
    @classmethod
    def get_email_instructions(cls, email: str) -> str:
        """Get setup instructions for a specific email provider"""
        domain = email.split('@')[1].lower()
        config = cls.EMAIL_PROVIDERS.get(domain, cls.DEFAULT_EMAIL_PROVIDER)
        return config.get('instructions', cls.DEFAULT_EMAIL_PROVIDER['instructions'])
    
    # App Configuration
    APP_NAME = "Legal Notice Generator"
    APP_VERSION = "1.0.0"
    
    # File paths
    IPC_SECTIONS_FILE = "ipc_sections.csv"
    IPC_INDEX_FILE = "ipc_index.faiss"
    
    # API Configuration
    API_HOST = os.getenv("API_HOST", "127.0.0.1")
    API_PORT = int(os.getenv("API_PORT", "8000"))
    
    # CORS Configuration
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s" 