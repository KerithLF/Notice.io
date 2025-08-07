#!/usr/bin/env python3
"""
Quick Email Help Script

This script provides immediate help for email authentication issues.
"""

def show_email_help():
    """Show email authentication help"""
    
    print("=" * 70)
    print("🚨 EMAIL AUTHENTICATION ISSUE DETECTED")
    print("=" * 70)
    print()
    
    print("❌ You're getting this error because Gmail (and other providers) have strict security policies.")
    print()
    
    print("🔧 IMMEDIATE SOLUTIONS:")
    print()
    
    print("📧 FOR GMAIL USERS:")
    print("1. Enable 2-Factor Authentication on your Google account")
    print("2. Generate an App Password:")
    print("   - Go to: https://myaccount.google.com/")
    print("   - Security → 2-Step Verification → App passwords")
    print("   - Generate a new app password for 'Mail'")
    print("   - Use this 16-character password instead of your regular password")
    print()
    
    print("📧 FOR OUTLOOK/HOTMAIL USERS:")
    print("- Use your regular email password")
    print("- If you have 2FA enabled, generate an app password")
    print()
    
    print("📧 FOR YAHOO USERS:")
    print("- You may need to enable 'Less secure app access'")
    print("- Or generate an app password if you have 2FA enabled")
    print()
    
    print("🧪 TEST YOUR CONFIGURATION:")
    print("Run this command to test your email setup:")
    print("   python test_email.py")
    print()
    
    print("📖 DETAILED GUIDE:")
    print("See EMAIL_SETUP.md for comprehensive instructions")
    print()
    
    print("=" * 70)
    print("💡 TIP: Most users need to use an App Password, not their regular password!")
    print("=" * 70)

if __name__ == "__main__":
    show_email_help() 