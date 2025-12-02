# Course Service - JAX-WS SOAP Web Service

## Overview
JAX-WS SOAP web service for managing university courses with role-based access control. All authenticated users (Admin, Student, Professor) can view courses, but only Admins can create, update, or delete courses.

## Features
- ✅ SOAP web service with JAX-WS
- ✅ JWT authentication integration with OAuth service
- ✅ Role-based access control
  - **View Operations**: All authenticated users (Admin, Student, Professor)
  - **Manage Operations**: Admin only
- ✅ Course management with time slots
- ✅ MongoDB integration (shared database)
- ✅ WSDL auto-generation

## Technology Stack
- **Java 21** - Programming language
- **JAX-WS** - SOAP web service framework
- **MongoDB** - Database (shared with OAuth service)
- **JWT** - Token authentication
- **Lombok** - Reduce boilerplate
- **SLF4J/Logback** - Logging

## Prerequisites
- Java 21 installed
- Maven installed
- MongoDB running on localhost:27017
- OAuth service running on localhost:8081

## Project Structure

```
cours_emploi_service/
├── src/main/java/com/university/cours/
│   ├── config/
│   │   └── MongoDBConfig.java          # MongoDB configuration
│   ├── dto/
│   │   ├── CourseDTO.java              # Course data transfer object
│   │   └── TimeSlotDTO.java            # Time slot DTO
│   ├── model/
│   │   ├── Course.java                 # Course entity
│   │   └── TimeSlot.java               # Time slot model
│   ├── repository/
│   │   └── CourseRepository.java       # MongoDB operations
│   ├── security/
│   │   └── JWTValidator.java           # JWT token validation
│   ├── service/
│   │   ├── ICourseService.java         # SOAP service interface
│   │   └── CourseServiceImpl.java      # Service implementation
│   └── CourseServicePublisher.java     # Main application
├── src/main/resources/
│   └── application.properties          # Configuration
└── pom.xml
```

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# MongoDB Configuration (same database as OAuth service)
mongodb.uri=mongodb://localhost:27017
mongodb.database=university_oauth

# JWT Configuration (must match OAuth service)
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# Service Configuration
service.host=localhost
service.port=8082
service.path=/courses
```

**Important**: The `jwt.secret` must match the OAuth service!

## Building the Service

```bash
# Navigate to the project directory
cd cours_emploi_service

# Clean and compile
mvn clean compile

# Package
mvn package
```

## Running the Service

```bash
# Using Maven
mvn exec:java -Dexec.mainClass="com.university.cours.CourseServicePublisher"

# Or using the JAR
java -jar target/cours-emploi-service-1.0.0.jar
```

The service will start on: `http://localhost:8082/courses`

WSDL available at: `http://localhost:8082/courses?wsdl`

## SOAP Operations

### View Operations (All Authenticated Users)

#### 1. Get All Courses
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:getAllCourses>
         <token>YOUR_JWT_TOKEN</token>
      </ser:getAllCourses>
   </soapenv:Body>
</soapenv:Envelope>
```

#### 2. Get Active Courses
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:getActiveCourses>
         <token>YOUR_JWT_TOKEN</token>
      </ser:getActiveCourses>
   </soapenv:Body>
</soapenv:Envelope>
```

#### 3. Get Course by ID
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:getCourseById>
         <token>YOUR_JWT_TOKEN</token>
         <id>507f1f77bcf86cd799439011</id>
      </ser:getCourseById>
   </soapenv:Body>
</soapenv:Envelope>
```

### Admin-Only Operations

#### 4. Create Course
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:createCourse>
         <token>YOUR_ADMIN_JWT_TOKEN</token>
         <course>
            <courseId>CS101</courseId>
            <courseName>Introduction to Computer Science</courseName>
            <courseCode>CS101</courseCode>
            <credits>3</credits>
            <description>Fundamentals of programming and computer science</description>
            <professorId>PROF001</professorId>
            <professorName>Dr. John Smith</professorName>
            <maxStudents>50</maxStudents>
            <enrolledStudents>0</enrolledStudents>
            <semester>Fall 2024</semester>
            <active>true</active>
            <timeSlots>
               <dayOfWeek>MONDAY</dayOfWeek>
               <startTime>09:00</startTime>
               <endTime>10:30</endTime>
               <room>Room 101</room>
            </timeSlots>
            <timeSlots>
               <dayOfWeek>WEDNESDAY</dayOfWeek>
               <startTime>09:00</startTime>
               <endTime>10:30</endTime>
               <room>Room 101</room>
            </timeSlots>
         </course>
      </ser:createCourse>
   </soapenv:Body>
</soapenv:Envelope>
```

#### 5. Update Course
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:updateCourse>
         <token>YOUR_ADMIN_JWT_TOKEN</token>
         <id>507f1f77bcf86cd799439011</id>
         <course>
            <courseId>CS101</courseId>
            <courseName>Introduction to Computer Science</courseName>
            <courseCode>CS101</courseCode>
            <credits>3</credits>
            <description>Updated description</description>
            <professorId>PROF001</professorId>
            <professorName>Dr. John Smith</professorName>
            <maxStudents>60</maxStudents>
            <enrolledStudents>25</enrolledStudents>
            <semester>Fall 2024</semester>
            <active>true</active>
         </course>
      </ser:updateCourse>
   </soapenv:Body>
</soapenv:Envelope>
```

#### 6. Delete Course
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:deleteCourse>
         <token>YOUR_ADMIN_JWT_TOKEN</token>
         <id>507f1f77bcf86cd799439011</id>
      </ser:deleteCourse>
   </soapenv:Body>
</soapenv:Envelope>
```

#### 7. Deactivate Course
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ser="http://service.cours.university.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:deactivateCourse>
         <token>YOUR_ADMIN_JWT_TOKEN</token>
         <id>507f1f77bcf86cd799439011</id>
      </ser:deactivateCourse>
   </soapenv:Body>
</soapenv:Envelope>
```

## Testing with SoapUI or Postman

### 1. Get Admin Token from OAuth Service
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "adminPassword"
  }'
```

### 2. Import WSDL
- Open SoapUI or Postman
- Import WSDL from: `http://localhost:8082/courses?wsdl`

### 3. Test Operations
- Use the admin token for create/update/delete operations
- Use any authenticated user token for view operations

## Course Model

```java
{
  "id": "507f1f77bcf86cd799439011",
  "courseId": "CS101",
  "courseName": "Introduction to Computer Science",
  "courseCode": "CS101",
  "credits": 3,
  "description": "Fundamentals of programming",
  "professorId": "PROF001",
  "professorName": "Dr. John Smith",
  "timeSlots": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "10:30",
      "room": "Room 101"
    }
  ],
  "maxStudents": 50,
  "enrolledStudents": 25,
  "semester": "Fall 2024",
  "active": true
}
```

## Access Control

### View Operations (All Authenticated Users)
- `getAllCourses()` - Get all courses
- `getActiveCourses()` - Get active courses only
- `getCourseById()` - Get specific course by ID
- `getCourseByCourseId()` - Get course by course ID

### Admin-Only Operations
- `createCourse()` - Create new course
- `updateCourse()` - Update existing course
- `deleteCourse()` - Delete course
- `deactivateCourse()` - Deactivate course

## Error Handling

SOAP faults are returned for errors:

```xml
<soap:Fault>
   <faultcode>soap:Server</faultcode>
   <faultstring>Access denied. Admin privileges required.</faultstring>
</soap:Fault>
```

**Common Errors:**
- **Authentication token is required** - Token missing
- **Invalid or expired token** - Token validation failed
- **Access denied. Admin privileges required** - Non-admin trying admin operation
- **Course not found** - Invalid course ID
- **Course with courseId X already exists** - Duplicate course ID

## Integration with OAuth Service

1. **Shared Database**: Uses `university_oauth` MongoDB database
2. **JWT Verification**: Validates tokens using same secret
3. **Role Checking**: Extracts role from JWT claims
4. **Token Format**: Expects raw JWT token (no "Bearer" prefix)

## Security Features

- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Admin-only operations protected
- ✅ All operations require authentication
- ✅ Secure token verification

## Production Checklist

- [ ] Change JWT secret to production value
- [ ] Update MongoDB URI for production
- [ ] Enable HTTPS/TLS
- [ ] Add rate limiting
- [ ] Implement logging and monitoring
- [ ] Add comprehensive tests
- [ ] Configure firewall rules
- [ ] Set up load balancing

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running on localhost:27017
- Check connection string in application.properties

### Authentication Failed
- Verify JWT_SECRET matches OAuth service
- Check token is valid and not expired
- Ensure token is passed correctly (no "Bearer" prefix)

### Access Denied
- Verify user has ADMIN role for admin operations
- Check token was issued to correct user type

### WSDL Not Accessible
- Ensure service is running
- Check firewall settings
- Verify port 8082 is not in use

## Next Steps

1. Add comprehensive unit tests
2. Implement caching for frequently accessed courses
3. Add course enrollment management
4. Implement course prerequisites
5. Add search and filtering capabilities
6. Create SOAP client libraries

## License
[Your License]

## Contact
[Your Contact Information]
