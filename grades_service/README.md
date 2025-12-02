# Grades Service - FastAPI REST API

## Overview
FastAPI REST API service for managing student grades with role-based access control. Professors can create, update, and delete grades, while students and admins can only view grades.

## Features
- ✅ Complete REST API with FastAPI
- ✅ JWT authentication integration with OAuth service
- ✅ Role-based access control
  - **Manage Operations**: Professors only
  - **View Operations**: Students, Admins, Professors
- ✅ Grade management with validation
- ✅ MongoDB integration (shared database)
- ✅ Auto-generated OpenAPI documentation

## Technology Stack
- **Python 3.8+** - Programming language
- **FastAPI** - Modern web framework
- **MongoDB** - Database (shared with OAuth service)
- **PyMongo** - MongoDB driver
- **Pydantic** - Data validation
- **python-jose** - JWT handling
- **Uvicorn** - ASGI server

## Prerequisites
- Python 3.8 or higher
- MongoDB running on localhost:27017
- OAuth service running on localhost:8081

## Project Structure

```
grades_service/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI application
│   ├── config.py                    # Configuration settings
│   ├── database.py                  # MongoDB connection
│   ├── auth.py                      # JWT authentication
│   ├── models/
│   │   ├── __init__.py
│   │   └── grade.py                 # Grade model
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── grade.py                 # Pydantic schemas
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── grade_repository.py      # Database operations
│   └── routes/
│       ├── __init__.py
│       └── grade_routes.py          # API endpoints
├── .env                             # Environment variables
├── .gitignore
├── requirements.txt
└── run.py                           # Application entry point
```

## Installation

### 1. Create Virtual Environment
```bash
cd grades_service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

## Configuration

Edit `.env` file:

```env
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# MongoDB (same database as OAuth service)
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=university_oauth

# JWT (must match OAuth service)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_ALGORITHM=HS256

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://localhost:3001
```

**Important**: The `JWT_SECRET` must match the OAuth service!

## Running the Service

```bash
# Using run.py
python run.py

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The service will start on: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## API Endpoints

### View Operations (Students, Admins, Professors)

#### 1. Get All Grades
```http
GET /api/grades?skip=0&limit=100
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "student_id": "STU001",
    "student_name": "John Doe",
    "course_id": "CS101",
    "course_name": "Introduction to Computer Science",
    "grade": 85.5,
    "semester": "Fall 2024",
    "professor_id": "PROF001",
    "professor_name": "Dr. Jane Smith",
    "comments": "Excellent work",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

#### 2. Get Grade by ID
```http
GET /api/grades/{grade_id}
Authorization: Bearer <token>
```

#### 3. Get Grades by Student
```http
GET /api/grades/student/{student_id}
Authorization: Bearer <token>
```

#### 4. Get Grades by Course
```http
GET /api/grades/course/{course_id}
Authorization: Bearer <token>
```

### Management Operations (Professors Only)

#### 5. Create Grade
```http
POST /api/grades
Authorization: Bearer <professor_token>
Content-Type: application/json

{
  "student_id": "STU001",
  "student_name": "John Doe",
  "course_id": "CS101",
  "course_name": "Introduction to Computer Science",
  "grade": 85.5,
  "semester": "Fall 2024",
  "professor_id": "PROF001",
  "professor_name": "Dr. Jane Smith",
  "comments": "Excellent work"
}
```

#### 6. Update Grade
```http
PUT /api/grades/{grade_id}
Authorization: Bearer <professor_token>
Content-Type: application/json

{
  "grade": 90.0,
  "comments": "Outstanding improvement"
}
```

#### 7. Delete Grade
```http
DELETE /api/grades/{grade_id}
Authorization: Bearer <professor_token>
```

#### 8. Get My Grades (Current Professor)
```http
GET /api/grades/professor/my-grades
Authorization: Bearer <professor_token>
```

## Usage Examples

### 1. Get Professor Token from OAuth Service
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "professor@university.edu",
    "password": "professorPassword"
  }'
```

### 2. Create a Grade
```bash
curl -X POST http://localhost:8000/api/grades \
  -H "Authorization: Bearer YOUR_PROFESSOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "student_name": "Alice Johnson",
    "course_id": "CS101",
    "course_name": "Intro to CS",
    "grade": 92.5,
    "semester": "Fall 2024",
    "professor_id": "PROF001",
    "professor_name": "Dr. Smith",
    "comments": "Excellent performance"
  }'
```

### 3. Get All Grades (Student View)
```bash
curl -X GET http://localhost:8000/api/grades \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### 4. Update a Grade
```bash
curl -X PUT http://localhost:8000/api/grades/GRADE_ID \
  -H "Authorization: Bearer YOUR_PROFESSOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade": 95.0,
    "comments": "Outstanding work"
  }'
```

## Grade Model

```python
{
  "id": "string",
  "student_id": "string",
  "student_name": "string",
  "course_id": "string",
  "course_name": "string",
  "grade": float (0-100),
  "semester": "string",
  "professor_id": "string",
  "professor_name": "string",
  "comments": "string (optional)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Access Control

### View Operations (All Authenticated Users)
- `GET /api/grades` - Get all grades
- `GET /api/grades/{id}` - Get grade by ID
- `GET /api/grades/student/{student_id}` - Get student grades
- `GET /api/grades/course/{course_id}` - Get course grades

### Professor-Only Operations
- `POST /api/grades` - Create grade
- `PUT /api/grades/{id}` - Update grade
- `DELETE /api/grades/{id}` - Delete grade
- `GET /api/grades/professor/my-grades` - Get my grades

## Error Responses

```json
{
  "detail": "Error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (delete success)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error

## Integration with OAuth Service

1. **Shared Database**: Uses `university_oauth` MongoDB database
2. **JWT Verification**: Validates tokens using same secret
3. **Role Extraction**: Gets user role from JWT claims
4. **Token Format**: Expects `Bearer <token>` in Authorization header

## Security Features

- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Professor-only operations protected
- ✅ CORS configuration
- ✅ Input validation with Pydantic
- ✅ Secure password handling

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## Development

### Run with Auto-Reload
```bash
python run.py
```

### Run Tests (if implemented)
```bash
pytest
```

## Production Checklist

- [ ] Change JWT_SECRET to production value
- [ ] Update MONGODB_URL for production database
- [ ] Restrict ALLOWED_ORIGINS to specific domains
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement comprehensive logging
- [ ] Add monitoring and health checks
- [ ] Set up CI/CD pipeline
- [ ] Add comprehensive tests

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running on localhost:27017
- Check MONGODB_URL in .env file

### 401 Unauthorized
- Verify JWT_SECRET matches OAuth service
- Check token is valid and not expired
- Ensure Authorization header format: `Bearer <token>`

### 403 Forbidden
- Verify user has PROFESSOR role for management operations
- Check token was issued to correct user type

### Import Errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

## Next Steps

1. Add comprehensive unit and integration tests
2. Implement grade statistics and analytics
3. Add grade history tracking
4. Implement grade export functionality
5. Add email notifications for grade updates
6. Create batch grade import feature

## License
[Your License]

## Contact
[Your Contact Information]
