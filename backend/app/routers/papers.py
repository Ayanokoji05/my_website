from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Publication
from ..schemas import PublicationCreate, PublicationResponse

router = APIRouter(prefix="/api/papers", tags=["papers"])

@router.get("/", response_model=List[PublicationResponse])
def get_all_publications(db: Session = Depends(get_db)):
    """Get all publications"""
    publications = db.query(Publication).order_by(Publication.year.desc(), Publication.order).all()
    return publications

@router.get("/{paper_id}", response_model=PublicationResponse)
def get_publication(paper_id: int, db: Session = Depends(get_db)):
    """Get a specific publication by ID"""
    publication = db.query(Publication).filter(Publication.id == paper_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    return publication

@router.post("/", response_model=PublicationResponse)
def create_publication(publication: PublicationCreate, db: Session = Depends(get_db)):
    """Create a new publication"""
    db_publication = Publication(**publication.model_dump())
    db.add(db_publication)
    db.commit()
    db.refresh(db_publication)
    return db_publication