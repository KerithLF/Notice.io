#!/usr/bin/env python3
"""
Email Configuration Test Script

This script helps you test your email configuration before using it in the main application.
It will attempt to send a test email to verify your credentials and SMTP settings.
"""

import sys
import os
from backend.config import Config
from backend.generator import send_notice_email

def test_email_configuration():
    """Test email configuration with user input"""
    
    print("=" * 60)
    print("EMAIL CONFIGURATION TEST")
    print("=" * 60)
    print()
    
    # Get email details from user
    sender_email = input("Enter your email address: ").strip()
    sender_password = input("Enter your email password (or app password): ").strip()
    recipient_email = input("Enter recipient email address (for testing): ").strip()
    
    if not all([sender_email, sender_password, recipient_email]):
        print("❌ All fields are required!")
        return False
    
    # Show configuration for the email provider
    email_config = Config.get_email_config(sender_email)
    instructions = Config.get_email_instructions(sender_email)
    
    print(f"\n📧 Email Provider: {sender_email.split('@')[1]}")
    print(f"🔧 SMTP Server: {email_config['smtp_server']}")
    print(f"🔌 SMTP Port: {email_config['smtp_port']}")
    print(f"🔒 TLS: {'Yes' if email_config['use_tls'] else 'No'}")
    
    print(f"\n📋 Setup Instructions:")
    print(instructions)
    
    # Confirm before testing
    print(f"\n⚠️  This will send a test email to: {recipient_email}")
    confirm = input("Do you want to proceed? (y/N): ").strip().lower()
    
    if confirm not in ['y', 'yes']:
        print("❌ Test cancelled.")
        return False
    
    # Test email sending
    try:
        print(f"\n🔄 Testing email configuration...")
        
        test_subject = "Test Email - Legal Notice Generator"
        test_message = f"""
This is a test email from the Legal Notice Generator application.

If you received this email, your email configuration is working correctly!

Test Details:
- Sender: {sender_email}
- Recipient: {recipient_email}
- SMTP Server: {email_config['smtp_server']}
- SMTP Port: {email_config['smtp_port']}

You can now use this email configuration in the main application.
        """
        
        result = send_notice_email(
            sender_email=sender_email,
            sender_password=sender_password,
            recipient_email=recipient_email,
            subject=test_subject,
            notice_text=test_message
        )
        
        print(f"✅ {result}")
        print(f"\n🎉 Email configuration test successful!")
        print(f"📧 Test email sent to: {recipient_email}")
        return True
        
    except Exception as e:
        print(f"❌ Email test failed: {str(e)}")
        return False

def main():
    """Main function"""
    try:
        success = test_email_configuration()
        if success:
            print(f"\n✅ You can now use these credentials in the main application!")
        else:
            print(f"\n❌ Please fix the email configuration and try again.")
            print(f"💡 Check the setup instructions above for your email provider.")
        
    except KeyboardInterrupt:
        print(f"\n\n❌ Test cancelled by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    main() 