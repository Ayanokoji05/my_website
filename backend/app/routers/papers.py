from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Publication
from ..schemas import PublicationCreate, PublicationResponse
from ..auth import verify_token

router = APIRouter(prefix="/api/papers", tags=["papers"])

@router.get("/", response_model=List[PublicationResponse])
def get_all_publications(db: Session = Depends(get_db)):
    """Get all publications - PUBLIC"""
    try:
        publications = db.query(Publication).order_by(Publication.year.desc(), Publication.order).limit(100).all()
        return publications
    except Exception as e:
        print(f"Error fetching publications: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{paper_id}", response_model=PublicationResponse)
def get_publication(paper_id: int, db: Session = Depends(get_db)):
    """Get a specific publication by ID - PUBLIC"""
    publication = db.query(Publication).filter(Publication.id == paper_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    return publication

@router.post("/", response_model=PublicationResponse)
def create_publication(
    publication: PublicationCreate,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Create a new publication - REQUIRES AUTH"""
    try:
        db_publication = Publication(**publication.model_dump())
        db.add(db_publication)
        db.commit()
        db.refresh(db_publication)
        return db_publication
    except Exception as e:
        db.rollback()
        print(f"Error creating publication: {e}")
        raise HTTPException(status_code=500, detail="Failed to create publication")

@router.put("/{paper_id}", response_model=PublicationResponse)
def update_publication(
    paper_id: int,
    publication_update: PublicationCreate,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Update a publication - REQUIRES AUTH"""
    publication = db.query(Publication).filter(Publication.id == paper_id).first()
    
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    
    try:
        for key, value in publication_update.model_dump().items():
            setattr(publication, key, value)
        
        db.commit()
        db.refresh(publication)
        return publication
    except Exception as e:
        db.rollback()
        print(f"Error updating publication: {e}")
        raise HTTPException(status_code=500, detail="Failed to update publication")

@router.delete("/{paper_id}")
def delete_publication(
    paper_id: int,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Delete a publication - REQUIRES AUTH"""
    publication = db.query(Publication).filter(Publication.id == paper_id).first()
    
    if not publication:
        raise HTTPException(status_code=404, detail="Publication not found")
    
    try:
        title = publication.title
        db.delete(publication)
        db.commit()
        return {"status": "success", "message": f"Publication '{title}' deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting publication: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete publication")