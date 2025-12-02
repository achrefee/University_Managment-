from typing import List
from fastapi import APIRouter, HTTPException, Depends, Query
from app.schemas.grade import GradeCreate, GradeUpdate, GradeResponse
from app.repositories.grade_repository import grade_repository
from app.auth import require_professor, require_student_or_admin, get_current_user

router = APIRouter(prefix="/api/grades", tags=["grades"])

# View operations (Students, Admins, Professors)

@router.get("/", response_model=List[GradeResponse])
async def get_all_grades(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: dict = Depends(require_student_or_admin)
):
    """Get all grades (accessible by students, admins, and professors)"""
    grades = grade_repository.get_all(skip=skip, limit=limit)
    return [
        GradeResponse(
            id=str(grade._id),
            student_id=grade.student_id,
            student_name=grade.student_name,
            course_id=grade.course_id,
            course_name=grade.course_name,
            grade=grade.grade,
            semester=grade.semester,
            professor_id=grade.professor_id,
            professor_name=grade.professor_name,
            comments=grade.comments,
            created_at=grade.created_at,
            updated_at=grade.updated_at
        )
        for grade in grades
    ]

@router.get("/{grade_id}", response_model=GradeResponse)
async def get_grade_by_id(
    grade_id: str,
    current_user: dict = Depends(require_student_or_admin)
):
    """Get grade by ID (accessible by students, admins, and professors)"""
    grade = grade_repository.get_by_id(grade_id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    return GradeResponse(
        id=str(grade._id),
        student_id=grade.student_id,
        student_name=grade.student_name,
        course_id=grade.course_id,
        course_name=grade.course_name,
        grade=grade.grade,
        semester=grade.semester,
        professor_id=grade.professor_id,
        professor_name=grade.professor_name,
        comments=grade.comments,
        created_at=grade.created_at,
        updated_at=grade.updated_at
    )

@router.get("/student/{student_id}", response_model=List[GradeResponse])
async def get_grades_by_student(
    student_id: str,
    current_user: dict = Depends(require_student_or_admin)
):
    """Get all grades for a specific student"""
    grades = grade_repository.get_by_student(student_id)
    return [
        GradeResponse(
            id=str(grade._id),
            student_id=grade.student_id,
            student_name=grade.student_name,
            course_id=grade.course_id,
            course_name=grade.course_name,
            grade=grade.grade,
            semester=grade.semester,
            professor_id=grade.professor_id,
            professor_name=grade.professor_name,
            comments=grade.comments,
            created_at=grade.created_at,
            updated_at=grade.updated_at
        )
        for grade in grades
    ]

@router.get("/course/{course_id}", response_model=List[GradeResponse])
async def get_grades_by_course(
    course_id: str,
    current_user: dict = Depends(require_student_or_admin)
):
    """Get all grades for a specific course"""
    grades = grade_repository.get_by_course(course_id)
    return [
        GradeResponse(
            id=str(grade._id),
            student_id=grade.student_id,
            student_name=grade.student_name,
            course_id=grade.course_id,
            course_name=grade.course_name,
            grade=grade.grade,
            semester=grade.semester,
            professor_id=grade.professor_id,
            professor_name=grade.professor_name,
            comments=grade.comments,
            created_at=grade.created_at,
            updated_at=grade.updated_at
        )
        for grade in grades
    ]

# Management operations (Professors only)

@router.post("/", response_model=GradeResponse, status_code=201)
async def create_grade(
    grade_data: GradeCreate,
    current_user: dict = Depends(require_professor)
):
    """Create a new grade (professors only)"""
    grade = grade_repository.create(
        grade_data,
        professor_id=current_user.get("user_id", ""),
        professor_name=current_user.get("email", "")
    )
    
    return GradeResponse(
        id=str(grade._id),
        student_id=grade.student_id,
        student_name=grade.student_name,
        course_id=grade.course_id,
        course_name=grade.course_name,
        grade=grade.grade,
        semester=grade.semester,
        professor_id=grade.professor_id,
        professor_name=grade.professor_name,
        comments=grade.comments,
        created_at=grade.created_at,
        updated_at=grade.updated_at
    )

@router.put("/{grade_id}", response_model=GradeResponse)
async def update_grade(
    grade_id: str,
    grade_data: GradeUpdate,
    current_user: dict = Depends(require_professor)
):
    """Update a grade (professors only)"""
    grade = grade_repository.update(grade_id, grade_data)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    return GradeResponse(
        id=str(grade._id),
        student_id=grade.student_id,
        student_name=grade.student_name,
        course_id=grade.course_id,
        course_name=grade.course_name,
        grade=grade.grade,
        semester=grade.semester,
        professor_id=grade.professor_id,
        professor_name=grade.professor_name,
        comments=grade.comments,
        created_at=grade.created_at,
        updated_at=grade.updated_at
    )

@router.delete("/{grade_id}", status_code=204)
async def delete_grade(
    grade_id: str,
    current_user: dict = Depends(require_professor)
):
    """Delete a grade (professors only)"""
    success = grade_repository.delete(grade_id)
    if not success:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    return None

@router.get("/professor/my-grades", response_model=List[GradeResponse])
async def get_my_grades(
    current_user: dict = Depends(require_professor)
):
    """Get all grades assigned by the current professor"""
    professor_id = current_user.get("user_id", "")
    grades = grade_repository.get_by_professor(professor_id)
    
    return [
        GradeResponse(
            id=str(grade._id),
            student_id=grade.student_id,
            student_name=grade.student_name,
            course_id=grade.course_id,
            course_name=grade.course_name,
            grade=grade.grade,
            semester=grade.semester,
            professor_id=grade.professor_id,
            professor_name=grade.professor_name,
            comments=grade.comments,
            created_at=grade.created_at,
            updated_at=grade.updated_at
        )
        for grade in grades
    ]
