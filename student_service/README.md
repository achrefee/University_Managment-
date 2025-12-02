# Student Service - University Management System

## Overview
Express.js microservice for managing student CRUD operations with admin-only access. Integrates with the OAuth service for JWT authentication and uses the same MongoDB database.

## Features
- ✅ Complete CRUD operations for students
- ✅ JWT authentication via OAuth service
- ✅ Admin-only access control
- ✅ Course and grade management
- ✅ Inscription fee status tracking
- ✅ Pagination and filtering
- ✅ Comprehensive error handling

## Technology Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (shared with OAuth service)
- **Mongoose** - ODM
- **JWT** - Token verification
- **Helmet** - Security headers
- **CORS** - Cross-origin support

## Prerequisites
- Node.js 16+ installed
- MongoDB running on localhost:27017
- OAuth service running on localhost:8081

## Installation

```bash
# Navigate to student_service directory
cd student_service

# Install dependencies
npm install
```

## Configuration

Edit `.env` file:

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/university_oauth
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
OAUTH_SERVICE_URL=http://localhost:8081
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

**Important**: The `JWT_SECRET` must match the OAuth service secret!

## Running the Service

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:3001`

## API Endpoints

All endpoints require:
- Valid JWT token in Authorization header
- Admin role (ROLE_ADMIN)

### Authentication Header
```
Authorization: Bearer <your_jwt_token>
```

### Student CRUD

#### Get All Students
```http
GET /api/students?page=1&limit=10&search=john&inscriptionFeeStatus=PAID
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name, email, or studentId
- `inscriptionFeeStatus` - Filter by PAID or NOT_PAID
- `enabled` - Filter by enabled status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### Get Student by ID
```http
GET /api/students/:id
```

#### Get Student by Student ID
```http
GET /api/students/studentId/:studentId
```

#### Get Student by Email
```http
GET /api/students/email/:email
```

#### Create Student
```http
POST /api/students
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "phoneNumber": "+1234567890",
  "password": "securePassword123",
  "studentId": "STU001",
  "inscriptionFeeStatus": "NOT_PAID"
}
```

#### Update Student
```http
PUT /api/students/:id
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+0987654321",
  "inscriptionFeeStatus": "PAID"
}
```

#### Delete Student
```http
DELETE /api/students/:id
```

### Course Management

#### Add Course to Student
```http
POST /api/students/:id/courses
Content-Type: application/json

{
  "courseId": "CS101",
  "courseName": "Introduction to Computer Science",
  "courseCode": "CS101",
  "credits": 3
}
```

#### Remove Course from Student
```http
DELETE /api/students/:id/courses/:courseId
```

### Grade Management

#### Add Grade to Student
```http
POST /api/students/:id/grades
Content-Type: application/json

{
  "courseId": "CS101",
  "courseName": "Introduction to Computer Science",
  "grade": 85.5,
  "semester": "Fall 2024"
}
```

### Inscription Fee Management

#### Update Inscription Fee Status
```http
PATCH /api/students/:id/inscription-fee
Content-Type: application/json

{
  "status": "PAID"
}
```

## Usage Example

### 1. Login to OAuth Service (Get Admin Token)
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "adminPassword"
  }'
```

Save the `token` from the response.

### 2. Get All Students
```bash
curl -X GET http://localhost:3001/api/students \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Create a Student
```bash
curl -X POST http://localhost:3001/api/students \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@university.edu",
    "phoneNumber": "+1234567890",
    "password": "password123",
    "studentId": "STU002"
  }'
```

### 4. Update Student
```bash
curl -X PUT http://localhost:3001/api/students/STUDENT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "inscriptionFeeStatus": "PAID"
  }'
```

## Project Structure

```
student_service/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── studentController.js # Request handlers
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── requireAdmin.js      # Admin authorization
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   └── Student.js           # Student schema
│   ├── routes/
│   │   └── studentRoutes.js     # API routes
│   ├── services/
│   │   └── studentService.js    # Business logic
│   └── server.js                # Main application
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Error Handling

The service returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- ✅ JWT token verification
- ✅ Admin-only access control
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Password field excluded from responses
- ✅ Input validation via Mongoose schemas

## Integration with OAuth Service

This service verifies JWT tokens issued by the OAuth service:

1. **Same JWT Secret**: Uses identical secret for token verification
2. **Same Database**: Connects to `university_oauth` database
3. **Role Verification**: Checks for `ROLE_ADMIN` in token claims
4. **Token Format**: Expects `Bearer <token>` in Authorization header

## Development

### Install Dependencies
```bash
npm install
```

### Run in Development Mode
```bash
npm run dev
```

### Environment Variables
Create `.env` file with required variables (see Configuration section)

## Production Checklist

- [ ] Change JWT_SECRET to match production OAuth service
- [ ] Update MONGODB_URI for production database
- [ ] Restrict ALLOWED_ORIGINS to specific domains
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up logging and monitoring
- [ ] Add comprehensive tests
- [ ] Configure process manager (PM2)

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running on localhost:27017
- Check connection string in `.env`

### 401 Unauthorized
- Verify token is valid and not expired
- Check JWT_SECRET matches OAuth service
- Ensure token is in correct format: `Bearer <token>`

### 403 Forbidden
- Verify user has ADMIN role
- Check token was issued to an admin user

## Next Steps

1. Add comprehensive unit and integration tests
2. Implement request validation with express-validator
3. Add API documentation with Swagger
4. Implement caching with Redis
5. Add logging with Winston
6. Set up CI/CD pipeline

## License
[Your License]

## Contact
[Your Contact Information]
