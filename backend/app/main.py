from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import blogs, contact, research, papers
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Academic Portfolio API",
    description="Backend API for Academic Portfolio Website",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(blogs.router)
app.include_router(contact.router)
app.include_router(research.router)
app.include_router(papers.router)

@app.get("/")
def read_root():
    """Root endpoint - API health check"""
    return {
        "message": "Academic Portfolio API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message":"API is running"}