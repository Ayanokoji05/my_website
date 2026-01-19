import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def send_contact_email(name: str, email: str, subject: str, message: str):
    """
    Send email notification when contact form is submitted
    """
    # Email configuration from environment variables
    smtp_host = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("EMAIL_PORT", "587"))
    sender_email = os.getenv("EMAIL_FROM")
    sender_password = os.getenv("EMAIL_PASSWORD")
    recipient_email = os.getenv("EMAIL_TO")
    
    # Validate email configuration
    if not all([sender_email, sender_password, recipient_email]):
        print("⚠️ Email not configured. Skipping email notification.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Portfolio Contact: {subject or 'New Message'}"
        msg["From"] = sender_email
        msg["To"] = recipient_email
        msg["Reply-To"] = email
        
        # Create email body
        text_content = f"""
New Contact Form Submission

From: {name}
Email: {email}
Subject: {subject or 'No subject'}

Message:
{message}

---
This email was sent from your Academic Portfolio contact form.
Reply directly to this email to respond to {name}.
        """
        
        html_content = f"""
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }}
        .content {{ background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }}
        .field {{ margin-bottom: 15px; }}
        .label {{ font-weight: bold; color: #667eea; }}
        .value {{ margin-top: 5px; }}
        .message-box {{ background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 10px; }}
        .footer {{ background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">📬 New Contact Form Submission</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From:</div>
                <div class="value">{name}</div>
            </div>
            <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:{email}">{email}</a></div>
            </div>
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">{subject or 'No subject'}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">{message.replace(chr(10), '<br>')}</div>
            </div>
        </div>
        <div class="footer">
            This email was sent from your Academic Portfolio contact form.<br>
            Reply directly to this email to respond to {name}.
        </div>
    </div>
</body>
</html>
        """
        
        # Attach both plain text and HTML versions
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        print(f"📧 Sending email to {recipient_email}...")
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        print("✅ Email sent successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False