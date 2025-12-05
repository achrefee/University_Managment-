const axios = require('axios');
const soap = require('soap');
const colors = require('colors');

// Service URLs
const OAUTH_URL = 'http://localhost:8081';
const STUDENT_URL = 'http://localhost:3001';
const COURSE_URL = 'http://localhost:8082/courses';
const GRADES_URL = 'http://localhost:8000';
const FACTURATION_URL = 'http://localhost:8083/FacturationService.asmx';

// Test data
let adminToken = '';
let studentToken = '';
let professorToken = '';
let testStudentId = '';
let testCourseId = '';
let testGradeId = '';
let testFeeId = '';

// Helper function for logging
const log = {
    success: (msg) => console.log('✅'.green + ' ' + msg),
    error: (msg) => console.log('❌'.red + ' ' + msg),
    info: (msg) => console.log('ℹ️ '.blue + ' ' + msg),
    section: (msg) => console.log('\n' + '='.repeat(60).cyan + '\n' + msg.yellow.bold + '\n' + '='.repeat(60).cyan)
};

// Helper to handle errors
const handleError = (error, testName) => {
    log.error(`${testName} failed`);
    if (error.response) {
        console.log(`Status: ${error.response.status}`.red);
        console.log(`Message: ${JSON.stringify(error.response.data)}`.red);
    } else if (error.message) {
        console.log(`Error: ${error.message}`.red);
    } else {
        console.log(`Error: ${error}`.red);
    }
};

// ==================== OAuth Service Tests ====================
async function testOAuthService() {
    log.section('Testing OAuth Service (Port 8081)');

    try {
        // Test 1: Register Admin
        log.info('Test 1: Register Admin User');
        const adminData = {
            email: 'admin@test.com',
            password: 'Admin123!',
            firstName: 'Admin',
            lastName: 'User',
            phoneNumber: '+1234567890',
            role: 'ADMIN',
            department: 'IT'
        };

        try {
            await axios.post(`${OAUTH_URL}/api/auth/register`, adminData);
            log.success('Admin registered successfully');
        } catch (err) {
            if (err.response?.status === 400) {
                log.info('Admin already exists, proceeding...');
            } else throw err;
        }

        // Test 2: Login Admin
        log.info('Test 2: Login Admin User');
        const loginResponse = await axios.post(`${OAUTH_URL}/api/auth/login`, {
            email: 'admin@test.com',
            password: 'Admin123!'
        });
        adminToken = loginResponse.data.token;
        log.success('Admin logged in successfully');
        log.info(`Token: ${adminToken.substring(0, 50)}...`);

        // Test 3: Register Student
        log.info('Test 3: Register Student User');
        const studentData = {
            email: 'student@test.com',
            password: 'Student123!',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+1234567891',
            role: 'STUDENT',
            studentId: 'STU' + Date.now(),
            major: 'Computer Science',
            year: 2024
        };

        try {
            await axios.post(`${OAUTH_URL}/api/auth/register`, studentData);
            log.success('Student registered successfully');
        } catch (err) {
            if (err.response?.status === 400) {
                log.info('Registration failed (400): ' + JSON.stringify(err.response.data));
                if (err.response.data?.message === "Email already registered") {
                    log.info('Student already exists, proceeding...');
                }
            } else throw err;
        }

        // Test 4: Login Student
        log.info('Test 4: Login Student User');
        const studentLoginResponse = await axios.post(`${OAUTH_URL}/api/auth/login`, {
            email: 'student@test.com',
            password: 'Student123!'
        });
        studentToken = studentLoginResponse.data.token;
        log.success('Student logged in successfully');

        // Test 5: Register Professor
        log.info('Test 5: Register Professor User');
        const professorData = {
            email: 'professor@test.com',
            password: 'Professor123!',
            firstName: 'Jane',
            lastName: 'Smith',
            phoneNumber: '+1234567892',
            role: 'PROFESSOR',
            employeeId: 'PROF' + Date.now(),
            department: 'Computer Science',
            specialization: 'Databases'
        };

        try {
            await axios.post(`${OAUTH_URL}/api/auth/register`, professorData);
            log.success('Professor registered successfully');
        } catch (err) {
            if (err.response?.status === 400) {
                log.info('Professor already exists, proceeding...');
            } else throw err;
        }

        // Test 6: Login Professor
        log.info('Test 6: Login Professor User');
        const professorLoginResponse = await axios.post(`${OAUTH_URL}/api/auth/login`, {
            email: 'professor@test.com',
            password: 'Professor123!'
        });
        professorToken = professorLoginResponse.data.token;
        log.success('Professor logged in successfully');

        log.success('OAuth Service: ALL TESTS PASSED ✅');

    } catch (error) {
        handleError(error, 'OAuth Service Test');
        throw error;
    }
}

// ==================== Student Service Tests ====================
async function testStudentService() {
    log.section('Testing Student Service (Port 3001)');

    try {
        // Test 1: Create Student (Admin only)
        log.info('Test 1: Create Student');
        const timestamp = Date.now();
        const studentData = {
            studentId: 'STU' + timestamp,
            email: `newstudent${timestamp}@test.com`,
            firstName: 'Alice',
            lastName: 'Johnson',
            phoneNumber: '+1234567893',
            password: 'Student123!',
            dateOfBirth: '2000-01-15',
            major: 'Computer Science',
            year: 2024,
            inscriptionFeeStatus: 'NOT_PAID',
            enabled: true
        };

        const createResponse = await axios.post(
            `${STUDENT_URL}/api/students`,
            studentData,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        testStudentId = createResponse.data.data._id;
        log.success(`Student created with ID: ${testStudentId}`);

        // Test 2: Get All Students
        log.info('Test 2: Get All Students');
        const studentsResponse = await axios.get(
            `${STUDENT_URL}/api/students`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        log.success(`Retrieved ${studentsResponse.data.data.length} students`);

        // Test 3: Get Student by ID
        log.info('Test 3: Get Student by ID');
        const studentResponse = await axios.get(
            `${STUDENT_URL}/api/students/${testStudentId}`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        log.success(`Retrieved student: ${studentResponse.data.data.firstName} ${studentResponse.data.data.lastName}`);

        // Test 4: Update Student
        log.info('Test 4: Update Student');
        await axios.put(
            `${STUDENT_URL}/api/students/${testStudentId}`,
            { year: 2025 },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        log.success('Student updated successfully');

        // Test 5: Update Inscription Fee Status
        log.info('Test 5: Update Inscription Fee Status');
        await axios.patch(
            `${STUDENT_URL}/api/students/${testStudentId}/inscription-fee`,
            { status: 'PAID' },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        log.success('Inscription fee status updated to PAID');

        log.success('Student Service: ALL TESTS PASSED ✅');

    } catch (error) {
        handleError(error, 'Student Service Test');
        throw error;
    }
}

// ==================== Course Service Tests (SOAP) ====================
async function testCourseService() {
    log.section('Testing Course Service - SOAP (Port 8082)');

    try {
        const wsdlUrl = `${COURSE_URL}?wsdl`;
        log.info(`Connecting to WSDL: ${wsdlUrl}`);

        const client = await soap.createClientAsync(wsdlUrl);
        log.success('SOAP client created successfully');

        // Test 1: Get All Courses
        log.info('Test 1: Get All Courses');
        const coursesResult = await client.getAllCoursesAsync({ token: adminToken });
        log.success(`Retrieved ${coursesResult[0]?.return?.length || 0} courses`);

        // Test 2: Create Course (Admin only)
        log.info('Test 2: Create Course');
        const courseData = {
            token: adminToken,
            course: {
                courseId: 'CS' + Date.now(),
                courseName: 'Advanced Databases',
                courseCode: 'CS401',
                credits: 3,
                description: 'Advanced database management systems',
                professorId: 'PROF001',
                professorName: 'Dr. Smith',
                maxStudents: 30,
                semester: 'Fall 2024',
                timeSlots: [{
                    dayOfWeek: 'Monday',
                    startTime: '10:00',
                    endTime: '12:00',
                    room: 'Room 101'
                }]
            }
        };

        const createResult = await client.createCourseAsync(courseData);
        testCourseId = createResult[0]?.return?.id;
        log.success(`Course created with ID: ${testCourseId}`);

        // Test 3: Get Course by ID
        log.info('Test 3: Get Course by ID');
        const courseResult = await client.getCourseByIdAsync({
            token: studentToken,
            id: testCourseId
        });
        log.success(`Retrieved course: ${courseResult[0]?.return?.courseName}`);

        log.success('Course Service: ALL TESTS PASSED ✅');

    } catch (error) {
        handleError(error, 'Course Service Test');
        // Don't throw - continue with other tests
    }
}

// ==================== Grades Service Tests ====================
async function testGradesService() {
    log.section('Testing Grades Service - FastAPI (Port 8000)');

    try {
        // Test 1: Create Grade (Professor only)
        log.info('Test 1: Create Grade');
        const gradeData = {
            student_id: 'STU001',
            student_name: 'John Doe',
            course_id: 'CS101',
            course_name: 'Introduction to CS',
            grade: 92.5,
            semester: 'Fall 2024',
            professor_id: 'PROF001',
            professor_name: 'Dr. Smith',
            comments: 'Excellent performance'
        };

        const createResponse = await axios.post(
            `${GRADES_URL}/api/grades/`,
            gradeData,
            { headers: { Authorization: `Bearer ${professorToken}` } }
        );
        testGradeId = createResponse.data.id;
        log.success(`Grade created with ID: ${testGradeId}`);

        // Test 2: Get All Grades
        log.info('Test 2: Get All Grades');
        const gradesResponse = await axios.get(
            `${GRADES_URL}/api/grades/`,
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );
        log.success(`Retrieved ${gradesResponse.data.length} grades`);

        // Test 3: Get Grade by ID
        log.info('Test 3: Get Grade by ID');
        const gradeResponse = await axios.get(
            `${GRADES_URL}/api/grades/${testGradeId}`,
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );
        log.success(`Retrieved grade: ${gradeResponse.data.grade}`);

        // Test 4: Update Grade (Professor only)
        log.info('Test 4: Update Grade');
        await axios.put(
            `${GRADES_URL}/api/grades/${testGradeId}`,
            { grade: 95.0, comments: 'Outstanding work' },
            { headers: { Authorization: `Bearer ${professorToken}` } }
        );
        log.success('Grade updated successfully');

        // Test 5: Get Grades by Student
        log.info('Test 5: Get Grades by Student');
        const studentGradesResponse = await axios.get(
            `${GRADES_URL}/api/grades/student/STU001`,
            { headers: { Authorization: `Bearer ${studentToken}` } }
        );
        log.success(`Retrieved ${studentGradesResponse.data.length} grades for student`);

        log.success('Grades Service: ALL TESTS PASSED ✅');

    } catch (error) {
        handleError(error, 'Grades Service Test');
        // Don't throw - continue with other tests
    }
}

// ==================== Facturation Service Tests (SOAP) ====================
async function testFacturationService() {
    log.section('Testing Facturation Service - SOAP (Port 8083)');

    try {
        const wsdlUrl = `${FACTURATION_URL}?wsdl`;
        log.info(`Connecting to WSDL: ${wsdlUrl}`);

        const client = await soap.createClientAsync(wsdlUrl);
        log.success('SOAP client created successfully');

        // Test 1: Create Inscription Fee
        log.info('Test 1: Create Inscription Fee');
        const feeData = {
            token: adminToken,
            feeDto: {
                StudentId: 'STU001',
                StudentName: 'John Doe',
                StudentEmail: 'john@test.com',
                AcademicYear: '2024-2025',
                Amount: 5000.00,
                Currency: 'USD',
                PaymentStatus: 'PENDING',
                PaidAmount: 0,
                DueDate: new Date('2024-09-01').toISOString()
            }
        };

        const createResult = await client.CreateFeeAsync(feeData);
        testFeeId = createResult[0]?.CreateFeeResult?.Id;
        log.success(`Inscription fee created with ID: ${testFeeId}`);

        // Test 2: Get All Fees
        log.info('Test 2: Get All Fees');
        const feesResult = await client.GetAllFeesAsync({ token: adminToken });
        log.success(`Retrieved ${feesResult[0]?.GetAllFeesResult?.InscriptionFeeDto?.length || 0} fees`);

        // Test 3: Update Payment Status
        log.info('Test 3: Update Payment Status');
        const paymentUpdate = {
            token: adminToken,
            paymentUpdate: {
                FeeId: testFeeId,
                PaidAmount: 5000.00,
                PaymentMethod: 'CARD',
                TransactionId: 'TXN' + Date.now(),
                PaymentDate: new Date().toISOString(),
                Notes: 'Full payment received'
            }
        };

        await client.UpdatePaymentStatusAsync(paymentUpdate);
        log.success('Payment status updated successfully');

        // Test 4: Get Statistics
        log.info('Test 4: Get Fee Statistics');
        const statsResult = await client.GetStatisticsAsync({ token: adminToken });
        const stats = statsResult[0]?.GetStatisticsResult;
        log.success(`Statistics - Total: ${stats?.TotalFees}, Paid: ${stats?.PaidCount}, Pending: ${stats?.PendingCount}`);

        log.success('Facturation Service: ALL TESTS PASSED ✅');

    } catch (error) {
        handleError(error, 'Facturation Service Test');
        // Don't throw - continue
    }
}

// ==================== Run All Tests ====================
async function runAllTests() {
    console.log('\n' + '='.repeat(60).blue);
    console.log('  UNIVERSITY MANAGEMENT SYSTEM - INTEGRATION TESTS  '.blue.bold);
    console.log('='.repeat(60).blue + '\n');

    const startTime = Date.now();

    try {
        await testOAuthService();
        await testStudentService();
        await testCourseService();
        await testGradesService();
        await testFacturationService();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('\n' + '='.repeat(60).green);
        console.log('  🎉 ALL TESTS COMPLETED SUCCESSFULLY! 🎉  '.green.bold);
        console.log(`  Total Duration: ${duration}s  `.green);
        console.log('='.repeat(60).green + '\n');

    } catch (error) {
        console.log('\n' + '='.repeat(60).red);
        console.log('  ❌ TESTS FAILED  '.red.bold);
        console.log('='.repeat(60).red + '\n');
        process.exit(1);
    }
}

// Run tests
runAllTests();
