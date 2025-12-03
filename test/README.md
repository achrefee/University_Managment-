# University Management System - Integration Tests

## Overview
Comprehensive Node.js integration test suite for all microservices in the University Management System.

## Services Tested
1. **OAuth Service** (Port 8081) - REST
2. **Student Service** (Port 3001) - REST
3. **Course Service** (Port 8082) - SOAP
4. **Grades Service** (Port 8000) - REST
5. **Facturation Service** (Port 8083) - SOAP

## Prerequisites

### 1. All Services Running
Ensure all services are running on their respective ports:
- OAuth: `http://localhost:8081`
- Student: `http://localhost:3001`
- Course: `http://localhost:8082/courses`
- Grades: `http://localhost:8000`
- Facturation: `http://localhost:8083`

### 2. MongoDB Running
```bash
# MongoDB should be running on localhost:27017
```

### 3. Node.js Installed
```bash
node --version  # Should be v14 or higher
```

## Installation

```bash
cd test
npm install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Individual Service Tests
```bash
npm run test:oauth        # OAuth Service only
npm run test:student      # Student Service only
npm run test:course       # Course Service only
npm run test:grades       # Grades Service only
npm run test:facturation  # Facturation Service only
```

## Test Coverage

### OAuth Service Tests
- ✅ Register Admin user
- ✅ Login Admin user
- ✅ Register Student user
- ✅ Login Student user
- ✅ Register Professor user
- ✅ Login Professor user
- ✅ Token generation and validation

### Student Service Tests
- ✅ Create student (Admin only)
- ✅ Get all students
- ✅ Get student by ID
- ✅ Update student
- ✅ Update inscription fee status

### Course Service Tests (SOAP)
- ✅ SOAP client connection
- ✅ Get all courses
- ✅ Create course (Admin only)
- ✅ Get course by ID
- ✅ WSDL validation

### Grades Service Tests
- ✅ Create grade (Professor only)
- ✅ Get all grades
- ✅ Get grade by ID
- ✅ Update grade (Professor only)
- ✅ Get grades by student

### Facturation Service Tests (SOAP)
- ✅ SOAP client connection
- ✅ Create inscription fee
- ✅ Get all fees
- ✅ Update payment status
- ✅ Get fee statistics

## Test Output

The test suite provides colored output:
- ✅ **Green** - Test passed
- ❌ **Red** - Test failed
- ℹ️ **Blue** - Information
- 🎯 **Yellow** - Section headers

Example output:
```
==========================================================
Testing OAuth Service (Port 8081)
==========================================================
ℹ️  Test 1: Register Admin User
✅ Admin registered successfully
ℹ️  Test 2: Login Admin User
✅ Admin logged in successfully
...
```

## Test Data

The tests create the following test data:
- **Admin**: admin@test.com / Admin123!
- **Student**: student@test.com / Student123!
- **Professor**: professor@test.com / Professor123!

## Troubleshooting

### Service Not Running
```
Error: connect ECONNREFUSED ::1:8081
```
**Solution**: Make sure the service is running on the specified port.

### Authentication Failed
```
401 Unauthorized
```
**Solution**: Check JWT_SECRET is the same across all services.

### SOAP Connection Failed
```
Error: WSDL not found
```
**Solution**: Verify SOAP services are running and WSDL is accessible at `?wsdl` endpoint.

### MongoDB Connection Failed
```
MongoError: connect ECONNREFUSED
```
**Solution**: Start MongoDB service on localhost:27017.

## Dependencies

```json
{
  "axios": "^1.6.5",      // REST API calls
  "soap": "^1.0.0",       // SOAP client
  "colors": "^1.4.0"      // Colored console output
}
```

## Project Structure

```
test/
├── package.json          # Dependencies
├── test-all.js          # Main test suite
├── tests/               # Individual test files
│   ├── oauth.test.js
│   ├── student.test.js
│   ├── course.test.js
│   ├── grades.test.js
│   └── facturation.test.js
└── README.md
```

## CI/CD Integration

The test suite returns:
- **Exit code 0**: All tests passed
- **Exit code 1**: One or more tests failed

Perfect for CI/CD pipelines:
```bash
npm test || exit 1
```

## Advanced Usage

### Custom Test URLs
Edit service URLs at the top of `test-all.js`:
```javascript
const OAUTH_URL = 'http://your-oauth-url:8081';
const STUDENT_URL = 'http://your-student-url:3001';
// ... etc
```

### Skip Specific Tests
Comment out test functions in `runAllTests()`:
```javascript
async function runAllTests() {
    await testOAuthService();
    await testStudentService();
    // await testCourseService();  // Skip this
    await testGradesService();
    await testFacturationService();
}
```

## Security Notes

⚠️ **WARNING**: These tests use hardcoded credentials for testing purposes only!

- Never use these credentials in production
- Change all passwords after testing
- Consider using environment variables for credentials

## Contributing

To add new tests:
1. Create test function in `test-all.js`
2. Follow the existing pattern
3. Use the logging helpers (`log.success`, `log.error`, etc.)
4. Add test to `runAllTests()` function

## License
MIT
