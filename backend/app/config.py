import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Required settings
    SECRET_KEY = os.getenv("SECRET_KEY")
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
    
    # Optional settings
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    # Email settings
    RESEND_API_KEY = os.getenv("RESEND_API_KEY")
    EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev")
    EMAIL_TO = os.getenv("EMAIL_TO")
    
    def validate(self):
        """Validate required environment variables"""
        errors = []
        
        if not self.SECRET_KEY or self.SECRET_KEY == "your-secret-key-change-this-in-production":
            errors.append("SECRET_KEY must be set to a secure random string")
        
        if not self.ADMIN_PASSWORD or self.ADMIN_PASSWORD == "change-this-strong-password":
            errors.append("ADMIN_PASSWORD must be changed from default")
        
        if self.ENVIRONMENT == "production" and "localhost" in self.ALLOWED_ORIGINS:
            errors.append("ALLOWED_ORIGINS should not include localhost in production")
        
        if errors:
            raise ValueError(f"Configuration errors:\n" + "\n".join(f"  - {e}" for e in errors))
        
        return True

settings = Settings()

# Validate on import in production
if settings.ENVIRONMENT == "production":
    settings.validate()