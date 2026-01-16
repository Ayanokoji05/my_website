from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import ContactMessage
from ..schemas import ContactMessageCreate, ContactMessageResponse

router = APIRouter(prefix="/api/contact", tags=["contact"])

@router.post("/", response_model=ContactMessageResponse)
def create_contact_message(message: ContactMessageCreate, db: Session = Depends(get_db)):
    """Submit a contact form message"""
    db_message = ContactMessage(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # TODO: Send email notification (we'll add this later)
    
    return db_message

@router.get("/", response_model=List[ContactMessageResponse])
def get_all_messages(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Get all contact messages (for admin use)"""
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()
    return messages
