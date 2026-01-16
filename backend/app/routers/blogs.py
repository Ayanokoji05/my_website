from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import BlogPost
from ..schemas import BlogPostCreate, BlogPostResponse

router = APIRouter(prefix="/api/blogs", tags=["blogs"])

@router.get("/", response_model=List[BlogPostResponse])
def get_all_blogs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get all published blog posts"""
    blogs = db.query(BlogPost).filter(BlogPost.published == True).order_by(BlogPost.created_at.desc()).offset(skip).limit(limit).all()
    return blogs

@router.get("/{blog_id}", response_model=BlogPostResponse)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    """Get a specific blog post by ID"""
    blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.post("/", response_model=BlogPostResponse)
def create_blog(blog: BlogPostCreate, db: Session = Depends(get_db)):
    """Create a new blog post"""
    db_blog = BlogPost(**blog.model_dump())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog