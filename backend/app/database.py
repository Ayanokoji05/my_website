"""
Database configuration for Academic Portfolio
Supports both SQLite (local dev) and PostgreSQL (production on Render)
This version fixes the disappearing blogs issue on Render's free tier
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
# Defaults to SQLite for local development if DATABASE_URL is not set
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")

# ============================================================================
# CRITICAL FIX FOR RENDER
# ============================================================================
# Render provides postgres:// URLs but SQLAlchemy requires postgresql://
# This conversion is necessary for PostgreSQL connections to work on Render
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    print("✅ Using PostgreSQL (production)")
else:
    print("⚠️  Using SQLite (local development)")

# ============================================================================
# Create database engine with optimized configuration
# ============================================================================
if "sqlite" in DATABASE_URL:
    # SQLite configuration for local development
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},  # Required for SQLite with FastAPI
        echo=False  # Set to True to see all SQL queries in console (useful for debugging)
    )
else:
    # PostgreSQL configuration for production on Render
    # Uses connection pooling for better performance and reliability
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,        # Use connection pooling
        pool_size=5,                # Keep 5 connections ready in the pool
        max_overflow=10,            # Allow up to 10 additional connections if needed
        pool_pre_ping=True,         # Verify connections are alive before using them
        pool_recycle=3600,          # Recycle connections after 1 hour (3600 seconds)
        echo=False                  # Set to True to see all SQL queries in console
    )

# Create session factory
# This is used to create database sessions for each request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database models
# All your models (Blog, Research, Contact, etc.) should inherit from this
Base = declarative_base()


# ============================================================================
# Database session dependency
# ============================================================================
def get_db():
    """
    Dependency function that provides a database session to FastAPI routes.
    Automatically manages session lifecycle (creation and cleanup).
    
    Usage in FastAPI endpoints:
        from sqlalchemy.orm import Session
        from database import get_db
        
        @app.get("/api/blogs")
        def get_blogs(db: Session = Depends(get_db)):
            blogs = db.query(Blog).all()
            return blogs
    
    The session is automatically closed after the request completes,
    even if an error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================================
# Helper functions
# ============================================================================
def test_connection():
    """
    Test if database connection is working.
    
    Returns:
        bool: True if connection successful, False otherwise
    
    Usage:
        from database import test_connection
        
        if test_connection():
            print("Database is ready!")
        else:
            print("Database connection failed!")
    """
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        print("✅ Database connection test successful")
        return True
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False


def init_db():
    """
    Create all database tables defined in your models.
    
    This should be called once when your application starts.
    It's safe to call multiple times - existing tables won't be recreated.
    
    Usage:
        from database import init_db
        from models import Base  # Import after models are defined
        
        @app.on_event("startup")
        async def startup():
            init_db()
    """
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables initialized")


def drop_all_tables():
    """
    Drop all database tables.
    
    ⚠️  WARNING: This will delete ALL data!
    Only use this for development/testing purposes.
    
    Usage:
        from database import drop_all_tables
        
        # Only in development!
        if os.getenv("ENVIRONMENT") == "development":
            drop_all_tables()
    """
    Base.metadata.drop_all(bind=engine)
    print("⚠️  All database tables dropped")


# ============================================================================
# Run tests when this file is executed directly
# ============================================================================
if __name__ == "__main__":
    # This code only runs when you execute: python database.py
    # It's useful for testing your database configuration
    
    print("="*50)
    print("Database Configuration Test")
    print("="*50)
    print(f"Database URL: {DATABASE_URL}")
    print(f"Database Type: {'PostgreSQL' if 'postgresql' in DATABASE_URL else 'SQLite'}")
    print("="*50)
    
    # Test the connection
    if test_connection():
        print("\n✅ Database is ready to use!")
    else:
        print("\n❌ Database connection failed. Check your configuration.")
        print("\nTroubleshooting:")
        print("1. For PostgreSQL: Verify DATABASE_URL is set correctly")
        print("2. For SQLite: Check file permissions")
        print("3. Check if database service is running")