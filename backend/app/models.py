from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime
from .database import Base

class BlogPost(Base):
    """Model for blog posts"""
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(String(500))  # Short preview
    author = Column(String(100), default="Your Name")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published = Column(Boolean, default=True)
    tags = Column(String(200))  # Comma-separated tags
    
    def __repr__(self):
        return f"<BlogPost {self.title}>"


class ContactMessage(Base):
    """Model for contact form submissions"""
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<ContactMessage from {self.name}>"


class ResearchProject(Base):
    """Model for research projects"""
    __tablename__ = "research_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(500))
    project_url = Column(String(500))  # Link to GitHub, etc.
    technologies = Column(String(300))  # Comma-separated
    status = Column(String(50), default="Completed")  # Completed, Ongoing, Planned
    start_date = Column(String(50))
    end_date = Column(String(50))
    order = Column(Integer, default=0)  # For custom ordering
    
    def __repr__(self):
        return f"<ResearchProject {self.title}>"


class Publication(Base):
    """Model for academic papers/publications"""
    __tablename__ = "publications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    authors = Column(String(500), nullable=False)
    journal = Column(String(200))
    year = Column(Integer)
    doi = Column(String(100))
    pdf_url = Column(String(500))
    abstract = Column(Text)
    citation = Column(Text)  # Formatted citation
    order = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<Publication {self.title}>"