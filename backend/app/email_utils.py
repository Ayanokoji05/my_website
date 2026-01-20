import os
from dotenv import load_dotenv
import resend

load_dotenv()

# Configure Resend
resend.api_key = os.getenv("RESEND_API_KEY")


def send_contact_email(name: str, email: str, subject: str, message: str):
    """
    Send email notification using Resend API (works on Render free tier)
    """
    sender_email = os.getenv("EMAIL_FROM", "onboarding@resend.dev")
    recipient_email = os.getenv("EMAIL_TO")
    
    # Validate configuration
    if not resend.api_key:
        print("⚠️ Resend API key not configured. Skipping email notification.")
        return False
    
    if not recipient_email:
        print("⚠️ Recipient email (EMAIL_TO) not configured.")
        return False
    
    try:
        # Create HTML email
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }}
        .container {{ 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .header {{ 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 30px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }}
        .content {{ 
            padding: 30px;
        }}
        .field {{ 
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }}
        .field:last-child {{
            border-bottom: none;
        }}
        .label {{ 
            font-weight: 600;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }}
        .value {{ 
            font-size: 15px;
            color: #333;
        }}
        .message-box {{ 
            background: #f9f9f9;
            padding: 20px;
            border-left: 4px solid #667eea;
            border-radius: 4px;
            margin-top: 10px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }}
        .footer {{ 
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #eee;
        }}
        .reply-button {{
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From</div>
                <div class="value">{name}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:{email}" style="color: #667eea; text-decoration: none;">{email}</a></div>
            </div>
            <div class="field">
                <div class="label">Subject</div>
                <div class="value">{subject or 'No subject'}</div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="message-box">{message}</div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <a href="mailto:{email}?subject=Re: {subject}" class="reply-button">
                    Reply to {name}
                </a>
            </div>
        </div>
        <div class="footer">
            This email was sent from your Academic Portfolio contact form.<br>
            <small>Sent via Resend</small>
        </div>
    </div>
</body>
</html>
        """
        
        # Plain text version
        text_content = f"""
New Contact Form Submission

From: {name}
Email: {email}
Subject: {subject or 'No subject'}

Message:
{message}

---
Reply to: {email}
        """
        
        # Send email using Resend
        print(f"📧 Sending email via Resend to {recipient_email}...")
        
        params = {
            "from": sender_email,
            "to": [recipient_email],
            "subject": f"Portfolio Contact: {subject or 'New Message'}",
            "html": html_content,
            "text": text_content,
            "reply_to": email,  # Allow direct reply to sender
        }
        
        response = resend.Emails.send(params)
        
        print(f"✅ Email sent successfully! ID: {response['id']}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending email via Resend: {e}")
        return False