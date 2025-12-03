# University Management System - Startup Guide

## Prerequisites

Before starting any service, ensure you have:

1. **MongoDB** running on `localhost:27017`
2. **Java 21** (for OAuth and Course services)
3. **Node.js v14+** (for Student service and tests)
4. **Python 3.8+** (for Grades service)
5. **.NET 8.0 SDK** (for Facturation service)

---

## Check MongoDB is Running

```bash
# Windows
mongod --version

# If not running, start it:
# Run MongoDB as a service or start manually
```

---

## 1. OAuth Service (Spring Boot - Port 8081)

**Location**: `oauth_service/oauth/`

### Start Service
```bash
cd oauth_service/oauth

# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Build and run JAR
mvn clean package
java -jar target/oauth-0.0.1-SNAPSHOT.jar
```

**Verify**: Open http://localhost:8081/actuator/health

**Expected Output**:
```
Started OauthApplication in X.XXX seconds
```

---

## 2. Student Service (Express.js - Port 3001)

**Location**: `student_service/`

### Install Dependencies (First Time)
```bash
cd student_service
npm install
```

### Start Service
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Verify**: Open http://localhost:3001/health

**Expected Output**:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## 3. Course Service (JAX-WS SOAP - Port 8082)

**Location**: `cours_emploi_service/`

### Build Service
```bash
cd cours_emploi_service
mvn clean compile
```

### Start Service
```bash
mvn exec:java -Dexec.mainClass="com.university.cours.CourseServicePublisher"
```

**Verify**: Open http://localhost:8082/courses?wsdl

**Expected Output**:
```
Course Service started at http://localhost:8082/courses
WSDL available at: http://localhost:8082/courses?wsdl
```

---

## 4. Grades Service (FastAPI - Port 8000)

**Location**: `grades_service/`

### Setup Virtual Environment (First Time)
```bash
cd grades_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Start Service
```bash
# Make sure virtual environment is activated
python run.py

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Verify**: Open http://localhost:8000/docs

**Expected Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
Connected to MongoDB: university_oauth
```

---

## 5. Facturation Service (.NET SOAP - Port 8083)

**Location**: `facturation_service/`

### Restore Dependencies (First Time)
```bash
cd facturation_service
dotnet restore
```

### Build Service
```bash
dotnet build
```

### Start Service
```bash
dotnet run
```

**Verify**: Open http://localhost:8083/FacturationService.asmx?wsdl

**Expected Output**:
```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://0.0.0.0:8083
```

---

## Quick Start - All Services

### Terminal 1: MongoDB
```bash
# Ensure MongoDB is running
mongod
```

### Terminal 2: OAuth Service
```bash
cd oauth_service/oauth
mvn spring-boot:run
```

### Terminal 3: Student Service
```bash
cd student_service
npm run dev
```

### Terminal 4: Course Service
```bash
cd cours_emploi_service
mvn exec:java -Dexec.mainClass="com.university.cours.CourseServicePublisher"
```

### Terminal 5: Grades Service
```bash
cd grades_service
venv\Scripts\activate  # Windows
python run.py
```

### Terminal 6: Facturation Service
```bash
cd facturation_service
dotnet run
```

---

## Service Health Checks

Once all services are running, verify them:

```bash
# OAuth Service
curl http://localhost:8081

# Student Service
curl http://localhost:3001/health

# Course Service (WSDL)
curl http://localhost:8082/courses?wsdl

# Grades Service
curl http://localhost:8000/health

# Facturation Service (WSDL)
curl http://localhost:8083/FacturationService.asmx?wsdl
```

---

## Running Tests

After all services are running:

```bash
cd test
npm install  # First time only
npm test
```

---

## Service URLs Summary

| Service | URL | Type | Documentation |
|---------|-----|------|---------------|
| OAuth | http://localhost:8081 | REST | Spring Boot |
| Student | http://localhost:3001 | REST | http://localhost:3001/health |
| Course | http://localhost:8082/courses | SOAP | http://localhost:8082/courses?wsdl |
| Grades | http://localhost:8000 | REST | http://localhost:8000/docs |
| Facturation | http://localhost:8083 | SOAP | http://localhost:8083/FacturationService.asmx?wsdl |

---

## Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :8081
taskkill /PID <process_id> /F

# Linux/Mac
lsof -i :8081
kill -9 <process_id>
```

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service

### Java Version Error
```
Error: A JNI error has occurred
```
**Solution**: Ensure Java 21 is installed and JAVA_HOME is set

### Python Virtual Environment Issues
```bash
# Deactivate and recreate
deactivate
rm -rf venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### .NET Build Errors
```bash
# Clean and rebuild
dotnet clean
dotnet restore
dotnet build
```

---

## Stopping Services

### Graceful Shutdown
- Press `Ctrl + C` in each terminal

### Force Kill (if needed)
```bash
# Windows
taskkill /F /IM java.exe
taskkill /F /IM node.exe
taskkill /F /IM python.exe
taskkill /F /IM dotnet.exe

# Linux/Mac
pkill -f java
pkill -f node
pkill -f python
pkill -f dotnet
```

---

## Environment Variables Check

Ensure all services have the correct JWT secret in their config files:

**JWT_SECRET**: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`

- OAuth: `oauth_service/oauth/src/main/resources/application.properties`
- Student: `student_service/.env`
- Course: `cours_emploi_service/src/main/resources/application.properties`
- Grades: `grades_service/.env`
- Facturation: `facturation_service/appsettings.json`

---

## Next Steps

1. ✅ Start all services
2. ✅ Verify health checks
3. ✅ Run integration tests: `cd test && npm test`
4. ✅ Start building your application!

---

## Support

For issues:
1. Check service logs in each terminal
2. Verify MongoDB is running
3. Ensure ports are not in use
4. Check configuration files match
5. Verify JWT_SECRET is consistent across all services
