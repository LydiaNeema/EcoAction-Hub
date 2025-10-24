from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


class CommunityActionCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    category: str = Field(..., pattern="^(Environment|Agriculture|Conservation|Education)$")
    location: str = Field(..., min_length=3, max_length=200)
    date: str  # Will be converted to datetime
    image: Optional[str] = None
    impact_metric: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Tree Planting Event",
                "description": "Join us to plant 100 native trees and restore the park ecosystem",
                "category": "Environment",
                "location": "Riverside Park, San Francisco",
                "date": "2025-10-18T09:00:00",
                "image": "/CommunityTreeplanting.jpeg",
                "impact_metric": "100 trees, 50 tons CO2/year"
            }
        }


class CommunityActionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[str] = Field(None, pattern="^(Environment|Agriculture|Conservation|Education)$")
    location: Optional[str] = Field(None, min_length=3, max_length=200)
    date: Optional[str] = None
    image: Optional[str] = None
    impact_metric: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(active|completed|cancelled)$")


class CommunityActionResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location: str
    date: datetime
    image: Optional[str]
    participants_count: int
    impact_metric: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ActionParticipantCreate(BaseModel):
    action_id: int


class ActionParticipantResponse(BaseModel):
    id: int
    action_id: int
    user_id: int
    joined_at: datetime

    class Config:
        from_attributes = True
