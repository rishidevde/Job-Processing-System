from pydantic import BaseModel, Field
from typing import Optional


# What the user sends when creating a job
class CreateJobRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    duration: int = Field(..., ge=5, le=30)  # must be between 5 and 30 seconds


# What we send back in API responses
class JobResponse(BaseModel):
    id: str
    name: str
    duration: int
    status: str
    created_at: str
    completed_at: Optional[str] = None