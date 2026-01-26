from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import BlogPost
from ..schemas import BlogPostCreate, BlogPostResponse
from ..auth import verify_token  # ✅ ADD THIS

router = APIRouter(prefix="/api/blogs", tags=["blogs"])

@router.get("/", response_model=List[BlogPostResponse])
def get_all_blogs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Get all published blog posts"""
    try:
        blogs = db.query(BlogPost)\
            .filter(BlogPost.published == True)\
            .order_by(BlogPost.created_at.desc())\
            .offset(skip)\
            .limit(min(limit, 100))\
            .all()
        return blogs
    except Exception as e:
        print(f"Error fetching blogs: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve blogs")

@router.get("/{blog_id}", response_model=BlogPostResponse)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    """Get a specific blog post by ID"""
    blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.post("/", response_model=BlogPostResponse)
def create_blog(
    blog: BlogPostCreate,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)  # ✅ ADD AUTH
):
    """Create a new blog post"""
    try:
        db_blog = BlogPost(**blog.model_dump())
        db.add(db_blog)
        db.commit()
        db.refresh(db_blog)
        return db_blog
    except Exception as e:
        db.rollback()
        print(f"Error creating blog: {e}")
        raise HTTPException(status_code=500, detail="Failed to create blog post")

@router.delete("/{blog_id}")
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)  # ✅ ADD AUTH
):
    """Delete a blog post by ID"""
    blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    try:
        title = blog.title
        db.delete(blog)
        db.commit()
        return {
            "status": "success",
            "message": f"Blog post '{title}' deleted successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error deleting blog: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete blog post")
    
@router.put("/{blog_id}", response_model=BlogPostResponse)
def update_blog(
    blog_id: int,
    blog_update: BlogPostCreate,
    db: Session = Depends(get_db),
    username: str = Depends(verify_token)
):
    """Update an existing blog post - REQUIRES AUTH"""
    blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    try:
        # Update fields
        for key, value in blog_update.model_dump().items():
            setattr(blog, key, value)
        
        # Update timestamp
        from datetime import datetime
        blog.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(blog)
        return blog
    except Exception as e:
        db.rollback()
        print(f"Error updating blog: {e}")
        raise HTTPException(status_code=500, detail="Failed to update blog post")