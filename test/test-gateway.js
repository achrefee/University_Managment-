const axios = require('axios');
const colors = require('colors');

// Gateway URL - all requests go through this single entry point
const GATEWAY_URL = 'http://localhost:8080';

// Test data
let adminToken = '';
let studentToken = '';
let professorToken = '';
let testStudentId = '';

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
    }
};

// ==================== Gateway Health Check ====================
async function testGatewayHealth() {
    log.section('Testing API Gateway Health (Port 8080)');

    try {
        log.info('Test 1: Gateway Actuator Health');
        const healthResponse = await axios.get(`${GATEWAY_URL}/actuator/health`);
        if (healthResponse.data.status === 'UP') {
            log.success('Gateway is UP and healthy');
        } else {
            log.error('Gateway health check failed');
            throw new Error('Gateway not healthy');
        }

        log.success('Gateway Health: PASSED ✅');
    } catch (error) {
        handleError(error, 'Gateway Health Test');
        throw error;
    }
}

// ==================== OAuth via Gateway ====================
async function testOAuthViaGateway() {
    log.section('Testing OAuth Service via Gateway');

    try {
        // Login Admin
        log.info('Test 1: Login Admin via Gateway');
        const loginResponse = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
            email: 'admin@test.com',
            password: 'Admin123!'
        });
        adminToken = loginResponse.data.token;
        log.success('Admin login via Gateway successful');
        log.info(`Token: ${adminToken.substring(0, 50)}...`);

        // Login Student
        log.info('Test 2: Login Student via Gateway');
        const studentLoginResponse = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
            email: 'student@test.com',
            password: 'Student123!'
        });
        studentToken = studentLoginResponse.data.token;
        log.success('Student login via Gateway successful');

        // Login Professor
        log.info('Test 3: Login Professor via Gateway');
        const professorLoginResponse = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
            email: 'professor@test.com',
            password: 'Professor123!'
        });
        professorToken = professorLoginResponse.data.token;
        log.success('Professor login via Gateway successful');

        log.success('OAuth via Gateway: ALL TESTS PASSED ✅');
    } catch (error) {
        handleError(error, 'OAuth via Gateway Test');
        throw error;
    }
}

// ==================== Student Service via Gateway ====================
async function testStudentViaGateway() {
    log.section('Testing Student Service via Gateway');

    try {
        // Create Student
        log.info('Test 1: Create Student via Gateway');
        const timestamp = Date.now();
        const studentData = {
            studentId: 'STU' + timestamp,
            email: `gateway_student${timestamp}@test.com`,
            firstName: 'Gateway',
            lastName: 'Student',
            phoneNumber: '+1234567999',
            password: 'Gateway123!',
            dateOfBirth: '2000-01-15',
            major: 'Computer Science',
            year: 2024,
            inscriptionFeeStatus: 'NOT_PAID',
            enabled: true
        };

        const createResponse = await axios.post(
            `${GATEWAY_URL}/api/students`,
            studentData,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        testStudentId = createResponse.data.data._id;
        log.success(`Student created via Gateway with ID: ${testStudentId}`);

        // Get All Students
        log.info('Test 2: Get All Students via Gateway');
        const studentsResponse = await axios.get(
            `${GATEWAY_URL}/api/students`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        log.success(`Retrieved ${studentsResponse.data.data.length} students via Gateway`);

        // Get Student by ID
        log.info('Test 3: Get Student by ID via Gateway');
        const studentResponse = await axios.get(
            `${GATEWAY_URL}/api/students/${testStudentId}`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        log.success(`Retrieved student: ${studentResponse.data.data.firstName} ${studentResponse.data.data.lastName}`);

        log.success('Student Service via Gateway: ALL TESTS PASSED ✅');
    } catch (error) {
        handleError(error, 'Student via Gateway Test');
        throw error;
    }
}

// ==================== Grades Service via Gateway ====================
async function testGradesViaGateway() {
    log.section('Testing Grades Service via Gateway');

    try {
        // Health Check
        log.info('Test 1: Grades Health via Gateway');
        const healthResponse = await axios.get(`${GATEWAY_URL}/api/grades/health`);
        log.success('Grades service health check passed');

        // Create Grade
        log.info('Test 2: Create Grade via Gateway');
        const gradeData = {
            student_id: 'STU001',
            student_name: 'Gateway Test',
            course_id: 'CS101',
            course_name: 'Introduction to CS',
            grade: 88.5,
            semester: 'Fall 2024',
            professor_id: 'PROF001',
            professor_name: 'Dr. Smith',
            comments: 'Test via gateway'
        };

        const createResponse = await axios.post(
            `${GATEWAY_URL}/api/grades/`,
            gradeData,
            { headers: { Authorization: `Bearer ${professorToken}` } }
        );
        log.success(`Grade created via Gateway with ID: ${createResponse.data.id}`);

        log.success('Grades Service via Gateway: ALL TESTS PASSED ✅');
    } catch (error) {
        handleError(error, 'Grades via Gateway Test');
        // Continue - don't throw
    }
}

// ==================== Run All Gateway Tests ====================
async function runGatewayTests() {
    console.log('\n' + '='.repeat(60).blue);
    console.log('  API GATEWAY INTEGRATION TESTS  '.blue.bold);
    console.log('='.repeat(60).blue + '\n');

    const startTime = Date.now();

    try {
        await testGatewayHealth();
        await testOAuthViaGateway();
        await testStudentViaGateway();
        await testGradesViaGateway();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('\n' + '='.repeat(60).green);
        console.log('  🎉 ALL GATEWAY TESTS COMPLETED! 🎉  '.green.bold);
        console.log(`  Total Duration: ${duration}s  `.green);
        console.log('='.repeat(60).green + '\n');

    } catch (error) {
        console.log('\n' + '='.repeat(60).red);
        console.log('  ❌ GATEWAY TESTS FAILED  '.red.bold);
        console.log('='.repeat(60).red + '\n');
        process.exit(1);
    }
}

// Run tests
runGatewayTests();
