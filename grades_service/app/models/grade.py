from datetime import datetime
from typing import Optional
from bson import ObjectId

class Grade:
    def __init__(
        self,
        student_id: str,
        student_name: str,
        course_id: str,
        course_name: str,
        grade: float,
        semester: str,
        professor_id: str,
        professor_name: str,
        comments: Optional[str] = None,
        _id: Optional[ObjectId] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self._id = _id
        self.student_id = student_id
        self.student_name = student_name
        self.course_id = course_id
        self.course_name = course_name
        self.grade = grade
        self.semester = semester
        self.professor_id = professor_id
        self.professor_name = professor_name
        self.comments = comments
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self):
        return {
            "_id": self._id,
            "student_id": self.student_id,
            "student_name": self.student_name,
            "course_id": self.course_id,
            "course_name": self.course_name,
            "grade": self.grade,
            "semester": self.semester,
            "professor_id": self.professor_id,
            "professor_name": self.professor_name,
            "comments": self.comments,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @staticmethod
    def from_dict(data: dict):
        return Grade(
            _id=data.get("_id"),
            student_id=data.get("student_id"),
            student_name=data.get("student_name"),
            course_id=data.get("course_id"),
            course_name=data.get("course_name"),
            grade=data.get("grade"),
            semester=data.get("semester"),
            professor_id=data.get("professor_id"),
            professor_name=data.get("professor_name"),
            comments=data.get("comments"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )
