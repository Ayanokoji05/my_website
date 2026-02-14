"""
Main FastAPI application for Academic Portfolio Backend
"""

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import logging
from typing import List

# Import local modules
import models
import schemas
import database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Academic Portfolio API",
    description="Backend API for academic portfolio website",
    version="1.0.0"
)

# CORS Configuration
# Add all your frontend URLs here
ALLOWED_ORIGINS = [
    "http://localhost:3000",              # Local React development
    "http://localhost:5173",              # Local Vite development
    "https://academic-portfolio-lyart.vercel.app",  # Your Vercel deployment
    # Add your custom domain here when you set it up
    # "https://yourname.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Event handlers
@app.on_event("startup")
async def startup_event():
    """
    Run on application startup
    """
    logger.info("🚀 Starting Academic Portfolio API...")
    
    # Test database connection
    if database.test_connection():
        logger.info("✅ Database connection verified")
    else:
        logger.error("❌ Database connection failed - app may not work correctly")
    
    # Create database tables if they don't exist
    try:
        models.Base.metadata.create_all(bind=database.engine)
        logger.info("✅ Database tables initialized")
    except Exception as e:
        logger.error(f"❌ Failed to initialize database tables: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Run on application shutdown
    """
    logger.info("👋 Shutting down Academic Portfolio API...")


# Middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log all incoming requests and their processing time
    """
    start_time = datetime.now()
    
    response = await call_next(request)
    
    duration = (datetime.now() - start_time).total_seconds()
    
    logger.info(
        f"{request.method} {request.url.path} "
        f"status={response.status_code} duration={duration:.3f}s"
    )
    
    return response


# ============================================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================================

@app.get("/", tags=["Status"])
def read_root():
    """
    Root endpoint - API status
    """
    return {
        "message": "Academic Portfolio API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Status"])
async def health_check(db: Session = Depends(database.get_db)):
    """
    Health check endpoint - verifies API and database are working
    """
    try:
        # Test database connection
        db.execute("SELECT 1")
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }
        )


# ============================================================================
# BLOG ENDPOINTS
# ============================================================================

@app.get("/api/blogs", response_model=List[schemas.Blog], tags=["Blogs"])
def get_blogs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """
    Get all blog posts
    
    - **skip**: Number of posts to skip (for pagination)
    - **limit**: Maximum number of posts to return
    """
    blogs = db.query(models.Blog).offset(skip).limit(limit).all()
    return blogs


@app.get("/api/blogs/{blog_id}", response_model=schemas.Blog, tags=["Blogs"])
def get_blog(blog_id: int, db: Session = Depends(database.get_db)):
    """
    Get a specific blog post by ID
    """
    blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog


@app.post("/api/blogs", response_model=schemas.Blog, tags=["Blogs"])
def create_blog(
    blog: schemas.BlogCreate,
    db: Session = Depends(database.get_db)
):
    """
    Create a new blog post
    """
    db_blog = models.Blog(**blog.dict())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    
    logger.info(f"Created new blog post: {db_blog.title} (ID: {db_blog.id})")
    return db_blog


@app.put("/api/blogs/{blog_id}", response_model=schemas.Blog, tags=["Blogs"])
def update_blog(
    blog_id: int,
    blog: schemas.BlogCreate,
    db: Session = Depends(database.get_db)
):
    """
    Update an existing blog post
    """
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    for key, value in blog.dict().items():
        setattr(db_blog, key, value)
    
    db.commit()
    db.refresh(db_blog)
    
    logger.info(f"Updated blog post: {db_blog.title} (ID: {db_blog.id})")
    return db_blog


@app.delete("/api/blogs/{blog_id}", tags=["Blogs"])
def delete_blog(blog_id: int, db: Session = Depends(database.get_db)):
    """
    Delete a blog post
    """
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(db_blog)
    db.commit()
    
    logger.info(f"Deleted blog post ID: {blog_id}")
    return {"message": "Blog post deleted successfully"}


# ============================================================================
# RESEARCH/PROJECTS ENDPOINTS
# ============================================================================

@app.get("/api/research", response_model=List[schemas.Research], tags=["Research"])
def get_research(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """
    Get all research projects
    """
    research = db.query(models.Research).offset(skip).limit(limit).all()
    return research


@app.post("/api/research", response_model=schemas.Research, tags=["Research"])
def create_research(
    research: schemas.ResearchCreate,
    db: Session = Depends(database.get_db)
):
    """
    Create a new research project
    """
    db_research = models.Research(**research.dict())
    db.add(db_research)
    db.commit()
    db.refresh(db_research)
    
    logger.info(f"Created new research project: {db_research.title}")
    return db_research


# ============================================================================
# CONTACT FORM ENDPOINTS
# ============================================================================

@app.get("/api/contacts", response_model=List[schemas.Contact], tags=["Contact"])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """
    Get all contact form submissions
    """
    contacts = db.query(models.Contact).offset(skip).limit(limit).all()
    return contacts


@app.post("/api/contacts", response_model=schemas.Contact, tags=["Contact"])
def create_contact(
    contact: schemas.ContactCreate,
    db: Session = Depends(database.get_db)
):
    """
    Submit a contact form message
    """
    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    logger.info(f"New contact message from: {db_contact.email}")
    
    # TODO: Send email notification here
    
    return db_contact


# ============================================================================
# PUBLICATIONS ENDPOINTS (if you want to store them in DB)
# ============================================================================

@app.get("/api/publications", response_model=List[schemas.Publication], tags=["Publications"])
def get_publications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    """
    Get all publications
    """
    publications = db.query(models.Publication).offset(skip).limit(limit).all()
    return publications


@app.post("/api/publications", response_model=schemas.Publication, tags=["Publications"])
def create_publication(
    publication: schemas.PublicationCreate,
    db: Session = Depends(database.get_db)
):
    """
    Add a new publication
    """
    db_publication = models.Publication(**publication.dict())
    db.add(db_publication)
    db.commit()
    db.refresh(db_publication)
    
    logger.info(f"Added new publication: {db_publication.title}")
    return db_publication


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)