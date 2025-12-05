# University Management System - Postman Testing Guide

## Overview

All requests go through the **API Gateway** on port **8080**.

```
Base URL: http://localhost:8080
```

---

## 1. Environment Setup

Create a Postman Environment with these variables:

| Variable | Initial Value |
|----------|---------------|
| `base_url` | `http://localhost:8080` |
| `admin_token` | *(empty - set after login)* |
| `student_token` | *(empty - set after login)* |
| `professor_token` | *(empty - set after login)* |

---

## 2. OAuth Service Tests

### 2.1 Register Admin
```
POST {{base_url}}/api/auth/register/admin
Content-Type: application/json

{
    "email": "admin@test.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
}
```

### 2.2 Login Admin
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
    "email": "admin@test.com",
    "password": "Admin123!"
}
```
**Post-response Script** (to save token):
```javascript
var jsonData = pm.response.json();
pm.environment.set("admin_token", jsonData.token);
```

### 2.3 Register Student
```
POST {{base_url}}/api/auth/register/student
Content-Type: application/json

{
    "email": "student@test.com",
    "password": "Student123!",
    "firstName": "John",
    "lastName": "Student"
}
```

### 2.4 Login Student
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
    "email": "student@test.com",
    "password": "Student123!"
}
```
**Post-response Script**:
```javascript
var jsonData = pm.response.json();
pm.environment.set("student_token", jsonData.token);
```

### 2.5 Register Professor
```
POST {{base_url}}/api/auth/register/professor
Content-Type: application/json

{
    "email": "professor@test.com",
    "password": "Professor123!",
    "firstName": "Jane",
    "lastName": "Professor"
}
```

### 2.6 Login Professor
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
    "email": "professor@test.com",
    "password": "Professor123!"
}
```
**Post-response Script**:
```javascript
var jsonData = pm.response.json();
pm.environment.set("professor_token", jsonData.token);
```

### 2.7 Validate Token
```
GET {{base_url}}/api/auth/validate?token={{admin_token}}
```

---

## 3. Student Service Tests

> **Note**: All Student endpoints require Admin role

### 3.1 Create Student
```
POST {{base_url}}/api/students
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
    "studentId": "STU001",
    "email": "alice@university.com",
    "firstName": "Alice",
    "lastName": "Johnson",
    "phoneNumber": "+1234567890",
    "password": "Alice123!",
    "dateOfBirth": "2000-05-15",
    "major": "Computer Science",
    "year": 2024,
    "inscriptionFeeStatus": "NOT_PAID",
    "enabled": true
}
```

### 3.2 Get All Students
```
GET {{base_url}}/api/students
Authorization: Bearer {{admin_token}}
```

### 3.3 Get Student by ID
```
GET {{base_url}}/api/students/:id
Authorization: Bearer {{admin_token}}
```

### 3.4 Update Student
```
PUT {{base_url}}/api/students/:id
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
    "firstName": "Alice Updated",
    "major": "Data Science"
}
```

### 3.5 Update Inscription Fee Status
```
PATCH {{base_url}}/api/students/:id/inscription-fee
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
    "status": "PAID"
}
```

### 3.6 Delete Student
```
DELETE {{base_url}}/api/students/:id
Authorization: Bearer {{admin_token}}
```

---

## 4. Grades Service Tests

### 4.1 Health Check
```
GET {{base_url}}/api/grades/health
```

### 4.2 Create Grade (Professor only)
```
POST {{base_url}}/api/grades/
Authorization: Bearer {{professor_token}}
Content-Type: application/json

{
    "student_id": "STU001",
    "student_name": "Alice Johnson",
    "course_id": "CS101",
    "course_name": "Introduction to Programming",
    "grade": 85.5,
    "semester": "Fall 2024",
    "comments": "Excellent work"
}
```

### 4.3 Get All Grades
```
GET {{base_url}}/api/grades/
Authorization: Bearer {{student_token}}
```

### 4.4 Get Grade by ID
```
GET {{base_url}}/api/grades/:grade_id
Authorization: Bearer {{student_token}}
```

### 4.5 Get Grades by Student
```
GET {{base_url}}/api/grades/student/:student_id
Authorization: Bearer {{student_token}}
```

### 4.6 Update Grade (Professor only)
```
PUT {{base_url}}/api/grades/:grade_id
Authorization: Bearer {{professor_token}}
Content-Type: application/json

{
    "grade": 90.0,
    "comments": "Updated grade after resubmission"
}
```

### 4.7 Delete Grade (Professor only)
```
DELETE {{base_url}}/api/grades/:grade_id
Authorization: Bearer {{professor_token}}
```

---

## 5. Course Service Tests (SOAP)

> **Note**: Course Service uses SOAP protocol. Use Postman's raw XML body.

### 5.1 Get WSDL
```
GET {{base_url}}/courses?wsdl
```

### 5.2 Get All Courses
```
POST {{base_url}}/courses
Content-Type: text/xml

<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Body>
      <ser:getAllCourses>
         <token>{{admin_token}}</token>
      </ser:getAllCourses>
   </soapenv:Body>
</soapenv:Envelope>
```

### 5.3 Create Course
```
POST {{base_url}}/courses
Content-Type: text/xml

<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Body>
      <ser:createCourse>
         <token>{{admin_token}}</token>
         <course>
            <courseName>Advanced Programming</courseName>
            <courseCode>CS201</courseCode>
            <credits>4</credits>
            <description>Advanced programming concepts</description>
            <professorId>PROF001</professorId>
            <professorName>Dr. Smith</professorName>
            <maxStudents>30</maxStudents>
            <semester>Fall 2024</semester>
         </course>
      </ser:createCourse>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 6. Facturation Service Tests (SOAP)

### 6.1 Get WSDL
```
GET {{base_url}}/FacturationService.asmx?wsdl
```

### 6.2 Create Fee
```
POST {{base_url}}/FacturationService.asmx
Content-Type: text/xml
SOAPAction: "CreateFee"

<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CreateFee xmlns="http://tempuri.org/">
      <token>{{admin_token}}</token>
      <feeDto>
        <StudentId>STU001</StudentId>
        <StudentName>Alice Johnson</StudentName>
        <StudentEmail>alice@university.com</StudentEmail>
        <AcademicYear>2024-2025</AcademicYear>
        <Amount>5000.00</Amount>
        <Currency>EUR</Currency>
        <PaymentStatus>PENDING</PaymentStatus>
        <DueDate>2024-12-31</DueDate>
      </feeDto>
    </CreateFee>
  </soap:Body>
</soap:Envelope>
```

---

## 7. Gateway Health Check

```
GET {{base_url}}/actuator/health
```

Expected response:
```json
{
    "status": "UP"
}
```

---

## Quick Reference

| Service | Method | Endpoint | Auth |
|---------|--------|----------|------|
| OAuth | POST | `/api/auth/login` | None |
| OAuth | POST | `/api/auth/register/admin` | None |
| OAuth | GET | `/api/auth/validate?token=` | None |
| Student | GET/POST | `/api/students` | Admin |
| Grades | GET | `/api/grades/health` | None |
| Grades | POST | `/api/grades/` | Professor |
| Grades | GET | `/api/grades/` | Student/Admin |
| Course | POST | `/courses` | SOAP + Token |
| Facturation | POST | `/FacturationService.asmx` | SOAP + Admin |
| Gateway | GET | `/actuator/health` | None |
