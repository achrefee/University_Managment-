from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from pymongo.collection import Collection
from app.database import get_database
from app.models.grade import Grade
from app.schemas.grade import GradeCreate, GradeUpdate

class GradeRepository:
    @property
    def collection(self) -> Collection:
        return get_database()["grades"]
    
    def create(self, grade_data: GradeCreate, professor_id: str, professor_name: str) -> Grade:
        """Create a new grade"""
        grade_dict = grade_data.model_dump()
        grade_dict["professor_id"] = professor_id
        grade_dict["professor_name"] = professor_name
        grade_dict["created_at"] = datetime.utcnow()
        grade_dict["updated_at"] = datetime.utcnow()
        
        result = self.collection.insert_one(grade_dict)
        grade_dict["_id"] = result.inserted_id
        
        return Grade.from_dict(grade_dict)
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[Grade]:
        """Get all grades with pagination"""
        cursor = self.collection.find().skip(skip).limit(limit).sort("created_at", -1)
        return [Grade.from_dict(doc) for doc in cursor]
    
    def get_by_id(self, grade_id: str) -> Optional[Grade]:
        """Get grade by ID"""
        try:
            doc = self.collection.find_one({"_id": ObjectId(grade_id)})
            return Grade.from_dict(doc) if doc else None
        except Exception:
            return None
    
    def get_by_student(self, student_id: str) -> List[Grade]:
        """Get all grades for a specific student"""
        cursor = self.collection.find({"student_id": student_id}).sort("created_at", -1)
        return [Grade.from_dict(doc) for doc in cursor]
    
    def get_by_course(self, course_id: str) -> List[Grade]:
        """Get all grades for a specific course"""
        cursor = self.collection.find({"course_id": course_id}).sort("student_name", 1)
        return [Grade.from_dict(doc) for doc in cursor]
    
    def get_by_professor(self, professor_id: str) -> List[Grade]:
        """Get all grades assigned by a specific professor"""
        cursor = self.collection.find({"professor_id": professor_id}).sort("created_at", -1)
        return [Grade.from_dict(doc) for doc in cursor]
    
    def update(self, grade_id: str, grade_data: GradeUpdate) -> Optional[Grade]:
        """Update a grade"""
        try:
            update_dict = {k: v for k, v in grade_data.model_dump().items() if v is not None}
            update_dict["updated_at"] = datetime.utcnow()
            
            result = self.collection.find_one_and_update(
                {"_id": ObjectId(grade_id)},
                {"$set": update_dict},
                return_document=True
            )
            
            return Grade.from_dict(result) if result else None
        except Exception:
            return None
    
    def delete(self, grade_id: str) -> bool:
        """Delete a grade"""
        try:
            result = self.collection.delete_one({"_id": ObjectId(grade_id)})
            return result.deleted_count > 0
        except Exception:
            return False
    
    def count(self) -> int:
        """Count total grades"""
        return self.collection.count_documents({})

grade_repository = GradeRepository()
