from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import ResearchProject
from ..schemas import ResearchProjectCreate, ResearchProjectResponse
from ..auth import verify_token

router = APIRouter(prefix="/api/research", tags=["research"])

@router.get("/", response_model=List[ResearchProjectResponse])
def get_all_projects(db: Session = Depends(get_db)):
    """Get all research projects - PUBLIC"""
    try:
        projects = db.query(ResearchProject).order_by(ResearchProject.order).limit(100).all()
        return projects
    except Exception as e:
        print(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=ResearchProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific research project by ID - PUBLIC"""
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Research project not found")
    return project

@router.post("/", response_model=ResearchProjectResponse)
def create_project(
    project: ResearchProjectCreate,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Create a new research project - REQUIRES AUTH"""
    try:
        db_project = ResearchProject(**project.model_dump())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    except Exception as e:
        db.rollback()
        print(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail="Failed to create project")

@router.put("/{project_id}", response_model=ResearchProjectResponse)
def update_project(
    project_id: int,
    project_update: ResearchProjectCreate,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Update a research project - REQUIRES AUTH"""
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Research project not found")
    
    try:
        for key, value in project_update.model_dump().items():
            setattr(project, key, value)
        
        db.commit()
        db.refresh(project)
        return project
    except Exception as e:
        db.rollback()
        print(f"Error updating project: {e}")
        raise HTTPException(status_code=500, detail="Failed to update project")

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Delete a research project - REQUIRES AUTH"""
    project = db.query(ResearchProject).filter(ResearchProject.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Research project not found")
    
    try:
        title = project.title
        db.delete(project)
        db.commit()
        return {"status": "success", "message": f"Project '{title}' deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error deleting project: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete project")