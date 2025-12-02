# OAuth Authentication Service - University Management System

## Overview
This is an independent OAuth2 authentication service for a university management system built with Spring Boot, JWT, and MongoDB.

## Features
- JWT-based authentication (access & refresh tokens)
- Role-based access control (Admin, Student, Professor)
- MongoDB integration
- Password encryption with BCrypt
- Comprehensive API endpoints
- Global exception handling

## Technology Stack
- Spring Boot 3.5.8
- Spring Security
- JWT (JJWT 0.12.3)
- MongoDB
- Lombok
- Java 21

## Quick Start

### Prerequisites
- Java 21
- MongoDB running on localhost:27017
- Maven

### Run the Application
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Server runs on: `http://localhost:8081`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token

### User Management
- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID (Admin only)
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `GET /api/student/all` - Get all students (Admin/Professor)
- `PUT /api/student/{id}` - Update student

### Professor Endpoints
- `GET /api/professor/profile` - Get professor profile
- `GET /api/professor/all` - Get all professors (Admin)
- `PUT /api/professor/{id}` - Update professor

### Admin Endpoints
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/all` - Get all admins (Admin)
- `PUT /api/admin/{id}` - Update admin

## Example Usage

### Register a Student
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "phoneNumber": "+1234567890",
    "password": "password123",
    "role": "STUDENT",
    "studentId": "STU001"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@university.edu",
    "password": "password123"
  }'
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:8081/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server
server.port=8081

# MongoDB
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=university_oauth

# JWT (Change in production!)
jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000
jwt.refresh-expiration=604800000
```

## User Roles

### Admin
- Full system access
- User management
- View all students and professors

### Student
- Access own profile
- View courses, grades, timetable
- Check inscription fee status

### Professor
- Access own profile
- View assigned students
- Manage courses and grades

## Security

- Passwords encrypted with BCrypt
- JWT tokens with 24-hour expiration
- Refresh tokens with 7-day expiration
- Role-based access control
- Stateless authentication

## Production Checklist

- [ ] Change JWT secret to a strong random value
- [ ] Enable HTTPS
- [ ] Restrict CORS origins
- [ ] Enable MongoDB authentication
- [ ] Add rate limiting
- [ ] Set up logging and monitoring
- [ ] Use environment variables for secrets
- [ ] Add comprehensive tests

## Project Structure

```
src/main/java/com/oauth/oauth/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/             # Data transfer objects
├── exception/       # Exception handling
├── model/           # Domain models
├── repository/      # MongoDB repositories
├── security/        # Security components
└── service/         # Business logic
```

## License
[Your License]

## Contact
[Your Contact Information]
