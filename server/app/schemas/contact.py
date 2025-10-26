from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class ContactMessageCreate(BaseModel):
    email: EmailStr
    category: str = Field(..., pattern="^(General|Technical|Feedback|Partnership)$")
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=10)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "category": "General",
                "subject": "Question about EcoAction Hub",
                "message": "I would like to know more about how to get involved in community actions."
            }
        }


class ContactMessageResponse(BaseModel):
    id: int
    email: str
    category: str
    subject: str
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
