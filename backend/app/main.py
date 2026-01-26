from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .database import engine, Base
from .routers import blogs, contact, research, papers, auth
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Academic Portfolio API",
    description="Backend API for Academic Portfolio Website",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None,
)

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
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Include routers
app.include_router(auth.router)
app.include_router(blogs.router)
app.include_router(contact.router)
app.include_router(research.router)
app.include_router(papers.router)

@app.get("/")
def read_root():
    return {
        "message": "Academic Portfolio API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.on_event("startup")
async def startup_event():
    print("🚀 Academic Portfolio API is starting...")
    print(f"📍 Allowed CORS origins: {origins}")
    print(f"🌍 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print("✅ Database tables created/verified")

@app.on_event("shutdown")
async def shutdown_event():
    print("👋 Academic Portfolio API is shutting down...")