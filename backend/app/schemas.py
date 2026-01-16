from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Blog Schemas
class BlogPostBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    author: Optional[str] = "Your Name"
    published: Optional[bool] = True
    tags: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Contact Schemas
class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageResponse(ContactMessageBase):
    id: int
    created_at: datetime
    read: bool
    
    class Config:
        from_attributes = True


# Research Project Schemas
class ResearchProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    project_url: Optional[str] = None
    technologies: Optional[str] = None
    status: Optional[str] = "Completed"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    order: Optional[int] = 0

class ResearchProjectCreate(ResearchProjectBase):
    pass

class ResearchProjectResponse(ResearchProjectBase):
    id: int
    
    class Config:
        from_attributes = True


# Publication Schemas
class PublicationBase(BaseModel):
    title: str
    authors: str
    journal: Optional[str] = None
    year: Optional[int] = None
    doi: Optional[str] = None
    pdf_url: Optional[str] = None
    abstract: Optional[str] = None
    citation: Optional[str] = None
    order: Optional[int] = 0

class PublicationCreate(PublicationBase):
    pass

class PublicationResponse(PublicationBase):
    id: int
    
    class Config:
        from_attributes = True
        