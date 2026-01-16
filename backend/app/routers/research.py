from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import ResearchProject
from ..schemas import ResearchProjectCreate, ResearchProjectResponse

router = APIRouter(prefix="/api/research", tags=["research"])

@router.get("/", response_model=List[ResearchProjectResponse])
def get_all_projects(db: Session = Depends(get_db)):
    """Get all research projects"""
    projects = db.query(ResearchProject).order_by(ResearchProject.order).all()
    return projects

@router.get("/{project_id}", response_model=ResearchProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific research project by ID"""
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Research project not found")
    return project

@router.post("/", response_model=ResearchProjectResponse)
def create_project(project: ResearchProjectCreate, db: Session = Depends(get_db)):
    """Create a new research project"""
    db_project = ResearchProject(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project