from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class GradeBase(BaseModel):
    student_id: str
    student_name: str
    course_id: str
    course_name: str
    grade: float = Field(..., ge=0, le=100)
    semester: str
    professor_id: str
    professor_name: str
    comments: Optional[str] = None

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    grade: Optional[float] = Field(None, ge=0, le=100)
    comments: Optional[str] = None

class GradeResponse(GradeBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
