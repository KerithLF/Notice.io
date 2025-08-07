# Email Configuration Guide

This guide will help you configure your email settings for the Legal Notice Generator application.

## Quick Test

Before using the main application, you can test your email configuration:

```bash
cd backend
python test_email.py
```

This will guide you through testing your email setup step by step.

## Supported Email Providers

The application supports the following email providers:

### Gmail
- **SMTP Server**: smtp.gmail.com
- **Port**: 587
- **TLS**: Required

**Setup Instructions:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password instead of your regular password

### Outlook/Hotmail
- **SMTP Server**: smtp-mail.outlook.com
- **Port**: 587
- **TLS**: Required

**Setup Instructions:**
- Use your regular email password
- If you have 2FA enabled, you may need to generate an app password

### Yahoo
- **SMTP Server**: smtp.mail.yahoo.com
- **Port**: 587
- **TLS**: Required

**Setup Instructions:**
- You may need to enable "Less secure app access" or use an app password
- Generate an app password if you have 2FA enabled

### Other Email Providers
For other email providers, the application will use default settings. You may need to:
- Check your email provider's SMTP settings
- Ensure SMTP access is enabled
- Contact your email provider for specific instructions

## Common Issues and Solutions

### Authentication Failed
**Error**: `(535, b'5.7.8 Username and Password not accepted')`

**Solutions:**
1. **For Gmail**: Use an App Password instead of your regular password
2. **For other providers**: Check if you need to enable "Less secure app access"
3. **Verify credentials**: Double-check your email and password

### Connection Timeout
**Error**: `Connection timeout` or `SMTP connection failed`

**Solutions:**
1. Check your internet connection
2. Verify the SMTP server and port settings
3. Check if your firewall is blocking the connection

### TLS/SSL Issues
**Error**: `SSL/TLS connection failed`

**Solutions:**
1. Ensure TLS is enabled (port 587)
2. Check if your email provider requires a different port
3. Update your email client settings

## Security Best Practices

1. **Use App Passwords**: For Gmail and other providers that support it
2. **Don't Share Credentials**: Keep your email credentials secure
3. **Regular Updates**: Keep your email passwords updated
4. **2FA**: Enable two-factor authentication when possible

## Testing Your Configuration

1. Run the test script: `python test_email.py`
2. Enter your email credentials
3. Send a test email to yourself
4. Verify the email is received

## Troubleshooting

If you continue to have issues:

1. **Check Email Provider Status**: Visit your email provider's status page
2. **Contact Support**: Reach out to your email provider's support
3. **Try Different Provider**: Consider using a different email provider for testing
4. **Check Logs**: Review the application logs for detailed error messages

## Environment Variables (Optional)

You can set email configuration using environment variables:

```bash
export EMAIL_SMTP_SERVER=smtp.gmail.com
export EMAIL_SMTP_PORT=587
export EMAIL_USE_TLS=true
```

## Support

If you need help with email configuration:
1. Check this guide first
2. Run the test script for diagnostics
3. Review the error messages carefully
4. Contact support with specific error details 