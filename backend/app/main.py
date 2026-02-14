"""
Academic Portfolio API - Main Application
FastAPI backend with PostgreSQL database support
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import os
from dotenv import load_dotenv

# Import local modules
from .database import engine, Base, get_db, test_connection
from .routers import blogs, contact, research, papers, auth

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Academic Portfolio API",
    description="Backend API for Academic Portfolio Website",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None,
)

# ============================================================================
# MIDDLEWARE CONFIGURATION
# ============================================================================

# Security: Trusted Host Middleware (only in production)
if os.getenv("ENVIRONMENT") == "production":
    allowed_hosts = os.getenv("ALLOWED_HOSTS", "https://academic-portfolio-api.onrender.com").split(",")
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[host.strip() for host in allowed_hosts]
    )

# CORS Configuration
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# Request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    """Log all incoming requests with timing"""
    start_time = datetime.now()
    
    # Process the request
    response = await call_next(request)
    
    # Calculate duration
    duration = (datetime.now() - start_time).total_seconds()
    
    # Log the request
    print(
        f"[{datetime.now().strftime('%H:%M:%S')}] "
        f"{request.method} {request.url.path} "
        f"→ {response.status_code} "
        f"({duration:.3f}s)"
    )
    
    return response


# ============================================================================
# ROUTERS
# ============================================================================

# Include all routers
app.include_router(auth.router)
app.include_router(blogs.router)
app.include_router(contact.router)
app.include_router(research.router)
app.include_router(papers.router)


# ============================================================================
# ROOT ENDPOINTS
# ============================================================================

@app.get("/", tags=["Status"])
def read_root():
    """
    Root endpoint - API status and information
    """
    return {
        "message": "Academic Portfolio API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs" if os.getenv("ENVIRONMENT") != "production" else "disabled in production",
        "environment": os.getenv("ENVIRONMENT", "development")
    }


@app.get("/api/health", tags=["Status"])
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint with database connectivity test
    
    Returns:
        - status: "healthy" or "unhealthy"
        - database: Database connection status
        - timestamp: Current server time
        - environment: Current environment (development/production)
    """
    try:
        # Test database connection
        db.execute("SELECT 1")
        
        # Get database type
        database_url = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")
        db_type = "PostgreSQL" if "postgresql" in database_url else "SQLite"
        
        return {
            "status": "healthy",
            "database": {
                "connected": True,
                "type": db_type
            },
            "timestamp": datetime.now().isoformat(),
            "environment": os.getenv("ENVIRONMENT", "development"),
            "version": "1.0.0"
        }
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return {
            "status": "unhealthy",
            "database": {
                "connected": False,
                "error": str(e)
            },
            "timestamp": datetime.now().isoformat(),
            "environment": os.getenv("ENVIRONMENT", "development")
        }


@app.get("/api/status", tags=["Status"])
def api_status():
    """
    Detailed API status information
    """
    database_url = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")
    db_type = "PostgreSQL" if "postgresql" in database_url else "SQLite"
    
    return {
        "api": {
            "name": "Academic Portfolio API",
            "version": "1.0.0",
            "status": "operational"
        },
        "database": {
            "type": db_type,
            "status": "connected"
        },
        "environment": os.getenv("ENVIRONMENT", "development"),
        "cors_origins": origins,
        "timestamp": datetime.now().isoformat()
    }


# ============================================================================
# LIFECYCLE EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Run on application startup
    - Test database connection
    - Verify tables are created
    - Display configuration info
    """
    print("=" * 60)
    print("🚀 Academic Portfolio API is starting...")
    print("=" * 60)
    
    # Environment info
    environment = os.getenv("ENVIRONMENT", "development")
    print(f"🌍 Environment: {environment}")
    
    # Database info
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        if "postgresql" in database_url:
            print("🗄️  Database: PostgreSQL (production)")
            # Mask the password in the URL for security
            safe_url = database_url.split("@")[1] if "@" in database_url else "***"
            print(f"📍 Database host: {safe_url}")
        else:
            print("🗄️  Database: SQLite (local development)")
    else:
        print("⚠️  Database: SQLite (local development - no DATABASE_URL set)")
    
    # Test database connection
    print("🔌 Testing database connection...")
    if test_connection():
        print("✅ Database connection verified")
    else:
        print("❌ Database connection failed - check configuration")
    
    # CORS origins
    print(f"📍 Allowed CORS origins: {origins}")
    
    # Tables
    print("✅ Database tables created/verified")
    
    # API endpoints
    print(f"📚 API Documentation: /docs")
    print(f"💚 Health Check: /api/health")
    
    print("=" * 60)
    print("✨ Academic Portfolio API is ready!")
    print("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """
    Run on application shutdown
    """
    print("=" * 60)
    print("👋 Academic Portfolio API is shutting down...")
    print("=" * 60)


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Custom 404 handler"""
    return {
        "error": "Not Found",
        "message": f"The endpoint {request.url.path} does not exist",
        "status_code": 404
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Custom 500 handler"""
    print(f"❌ Internal Server Error: {exc}")
    return {
        "error": "Internal Server Error",
        "message": "An unexpected error occurred",
        "status_code": 500
    }


# ============================================================================
# MAIN ENTRY POINT (for local development)
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    print("Starting Academic Portfolio API in development mode...")
    print("Access at: http://localhost:8000")
    print("API Docs at: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )