#!/usr/bin/env python3
"""
Quick Email Test for LexFintech.io
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def test_lexfintech_email():
    """Test email configuration for lexfintech.io"""
    
    print("=" * 60)
    print("🔍 TESTING LEXFINTECH.IO EMAIL CONFIGURATION")
    print("=" * 60)
    print()
    
    # Test email details
    sender_email = "kerith.perla@lexfintech.io"
    recipient_email = "kerithpaul188@gmail.com"
    
    print(f"📧 Testing email: {sender_email}")
    print(f"📧 Recipient: {recipient_email}")
    print()
    
    # Get password from user
    sender_password = input("Enter your password (or App Password): ").strip()
    
    if not sender_password:
        print("❌ Password is required!")
        return False
    
    print()
    print("🔄 Testing different SMTP configurations...")
    print()
    
    # Test different SMTP configurations
    smtp_configs = [
        {
            'name': 'Gmail SMTP (Default)',
            'server': 'smtp.gmail.com',
            'port': 587,
            'use_tls': True
        },
        {
            'name': 'Gmail SMTP (SSL)',
            'server': 'smtp.gmail.com',
            'port': 465,
            'use_tls': False,
            'use_ssl': True
        },
        {
            'name': 'Outlook SMTP',
            'server': 'smtp-mail.outlook.com',
            'port': 587,
            'use_tls': True
        }
    ]
    
    for config in smtp_configs:
        print(f"🔧 Testing: {config['name']}")
        print(f"   Server: {config['server']}:{config['port']}")
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = recipient_email
            msg['Subject'] = "Test Email - Legal Notice Generator"
            
            body = f"""
This is a test email from the Legal Notice Generator application.

Test Details:
- Sender: {sender_email}
- Recipient: {recipient_email}
- SMTP Server: {config['server']}:{config['port']}
- Configuration: {config['name']}

If you received this email, your configuration is working!
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Connect to SMTP server
            if config.get('use_ssl'):
                server = smtplib.SMTP_SSL(config['server'], config['port'])
            else:
                server = smtplib.SMTP(config['server'], config['port'])
                if config['use_tls']:
                    server.starttls()
            
            # Login
            server.login(sender_email, sender_password)
            
            # Send email
            server.send_message(msg)
            server.quit()
            
            print(f"   ✅ SUCCESS! Email sent using {config['name']}")
            print(f"   📧 Check your inbox: {recipient_email}")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            print(f"   ❌ Authentication failed: {e}")
            if "Username and Password not accepted" in str(e):
                print(f"   💡 This usually means you need an App Password")
        except Exception as e:
            print(f"   ❌ Connection failed: {e}")
        
        print()
    
    print("❌ All SMTP configurations failed!")
    print()
    print("🔧 TROUBLESHOOTING STEPS:")
    print("1. For Gmail/Google Workspace:")
    print("   - Enable 2-Factor Authentication")
    print("   - Generate an App Password")
    print("   - Use the 16-character App Password")
    print()
    print("2. For custom email servers:")
    print("   - Contact your IT administrator")
    print("   - Ask for SMTP server settings")
    print("   - Verify your email credentials")
    print()
    print("3. Alternative solutions:")
    print("   - Try using a different email provider")
    print("   - Use Gmail with App Password")
    print("   - Check if your email provider blocks SMTP")
    
    return False

if __name__ == "__main__":
    test_lexfintech_email() 