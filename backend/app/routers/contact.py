from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from collections import defaultdict
from ..database import get_db
from ..models import ContactMessage
from ..schemas import ContactMessageCreate, ContactMessageResponse
from ..email_utils import send_contact_email

router = APIRouter(prefix="/api/contact", tags=["contact"])

# Simple in-memory rate limiter
last_submission = defaultdict(lambda: datetime.min)


@router.post("/", response_model=ContactMessageResponse)
def create_contact_message(message: ContactMessageCreate, db: Session = Depends(get_db)):
    """Submit a contact form message with rate limiting and email notification"""
    
    # Rate limit: 1 email per 5 minutes per email address
    email_key = message.email.lower()
    time_since_last = datetime.now() - last_submission[email_key]
    
    if time_since_last < timedelta(minutes=5):
        raise HTTPException(
            status_code=429,
            detail="Please wait 5 minutes before sending another message."
        )
    
    # Update last submission time
    last_submission[email_key] = datetime.now()
    
    # Save to database
    try:
        db_message = ContactMessage(**message.model_dump())
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
    except Exception as e:
        db.rollback()
        print(f"Database error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to save message. Please try again."
        )
    
    # Send email notification (don't fail if email fails)
    try:
        send_contact_email(
            name=message.name,
            email=message.email,
            subject=message.subject or "New Contact Form Submission",
            message=message.message
        )
        print(f"✅ Email notification sent for message from {message.name}")
    except Exception as e:
        # Log error but don't fail the request - message is still saved
        print(f"⚠️ Email notification failed: {e}")
        # You could add this to a background retry queue here
    
    return db_message


@router.get("/", response_model=List[ContactMessageResponse])
def get_all_messages(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Get all contact messages (for admin use)"""
    try:
        messages = db.query(ContactMessage)\
            .order_by(ContactMessage.created_at.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()
        return messages
    except Exception as e:
        print(f"Error fetching messages: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve messages"
        )


@router.get("/{message_id}", response_model=ContactMessageResponse)
def get_message(message_id: int, db: Session = Depends(get_db)):
    """Get a specific contact message by ID"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@router.delete("/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    """Delete a contact message (admin only)"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    try:
        db.delete(message)
        db.commit()
        return {"status": "success", "message": "Contact message deleted"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting message: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete message"
        )


@router.patch("/{message_id}/mark-read")
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    """Mark a contact message as read"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    try:
        message.read = True
        db.commit()
        db.refresh(message)
        return message
    except Exception as e:
        db.rollback()
        print(f"Error updating message: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to update message"
        )