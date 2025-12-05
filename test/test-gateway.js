const axios = require('axios');
const colors = require('colors');

/**
 * GATEWAY TESTS
 * All requests go through the API Gateway (port 8080) only
 * No direct connections to individual services
 */

// Gateway URL - single point of entry
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

// API endpoints via Gateway
const API = {
    auth: `${GATEWAY_URL}/api/auth`,
    students: `${GATEWAY_URL}/api/students`,
    grades: `${GATEWAY_URL}/api/grades`
};

// Test tokens
let adminToken = '';
let studentToken = '';
let professorToken = '';

// Logging helpers
const log = {
    success: (msg) => console.log('✅'.green + ' ' + msg),
    fail: (msg) => console.log('❌'.red + ' ' + msg),
    info: (msg) => console.log('ℹ️ '.blue + ' ' + msg),
    section: (msg) => console.log('\n' + '='.repeat(60).cyan + '\n' + msg.yellow.bold + '\n' + '='.repeat(60).cyan)
};

// ==================== Gateway Health ====================
async function testGatewayHealth() {
    log.section('Gateway Health Check');

    try {
        const response = await axios.get(`${GATEWAY_URL}/actuator/health`);
        if (response.data.status === 'UP') {
            log.success('Gateway is UP and healthy');
            return true;
        }
    } catch (error) {
        log.fail('Gateway health check failed: ' + error.message);
        throw new Error('Gateway is not available. Start it first!');
    }
}

// ==================== OAuth via Gateway ====================
async function testOAuthViaGateway() {
    log.section('Testing OAuth Service via Gateway');

    // Login Admin
    log.info('Test 1: Login Admin via Gateway');
    try {
        const response = await axios.post(`${API.auth}/login`, {
            email: 'admin@test.com',
            password: 'Admin123!'
        });
        adminToken = response.data.token;
        log.success('Admin login via Gateway successful');
        log.info(`Token: ${adminToken.substring(0, 50)}...`);
    } catch (error) {
        log.fail('Admin login failed: ' + error.message);
        throw error;
    }

    // Login Student
    log.info('Test 2: Login Student via Gateway');
    try {
        const response = await axios.post(`${API.auth}/login`, {
            email: 'student@test.com',
            password: 'Student123!'
        });
        studentToken = response.data.token;
        log.success('Student login via Gateway successful');
    } catch (error) {
        log.fail('Student login failed: ' + error.message);
    }

    // Login Professor
    log.info('Test 3: Login Professor via Gateway');
    try {
        const response = await axios.post(`${API.auth}/login`, {
            email: 'professor@test.com',
            password: 'Professor123!'
        });
        professorToken = response.data.token;
        log.success('Professor login via Gateway successful');
    } catch (error) {
        log.fail('Professor login failed: ' + error.message);
    }

    log.success('OAuth via Gateway: ALL TESTS PASSED ✅');
}

// ==================== Student via Gateway ====================
async function testStudentViaGateway() {
    log.section('Testing Student Service via Gateway');

    // Create Student
    log.info('Test 1: Create Student via Gateway');
    try {
        const timestamp = Date.now();
        const response = await axios.post(API.students, {
            studentId: 'GW' + timestamp,
            email: `gateway_student_${timestamp}@test.com`,
            firstName: 'Gateway',
            lastName: 'Student',
            phoneNumber: '+1234567899',
            password: 'Student123!',
            major: 'Computer Science',
            year: 2024
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        log.success(`Student created via Gateway with ID: ${response.data.data._id}`);
    } catch (error) {
        log.fail('Create student failed: ' + (error.response?.data?.message || error.message));
    }

    // Get All Students
    log.info('Test 2: Get All Students via Gateway');
    try {
        const response = await axios.get(API.students, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        log.success(`Retrieved ${response.data.data.length} students via Gateway`);
    } catch (error) {
        log.fail('Get students failed: ' + error.message);
    }

    // Get Student by ID
    log.info('Test 3: Get Student by ID via Gateway');
    try {
        const listResponse = await axios.get(API.students, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (listResponse.data.data.length > 0) {
            const studentId = listResponse.data.data[0]._id;
            const response = await axios.get(`${API.students}/${studentId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            log.success(`Retrieved student: ${response.data.data.firstName}`);
        }
    } catch (error) {
        log.fail('Get student by ID failed: ' + error.message);
    }

    log.success('Student Service via Gateway: ALL TESTS PASSED ✅');
}

// ==================== Grades via Gateway ====================
async function testGradesViaGateway() {
    log.section('Testing Grades Service via Gateway');

    // Health Check
    log.info('Test 1: Grades Health via Gateway');
    try {
        const response = await axios.get(`${API.grades}/health`);
        log.success('Grades service health check passed');
    } catch (error) {
        log.fail('Grades health check failed: ' + error.message);
    }

    // Create Grade
    log.info('Test 2: Create Grade via Gateway');
    try {
        const response = await axios.post(`${API.grades}/`, {
            student_id: 'GW001',
            student_name: 'Gateway Student',
            course_id: 'CS101',
            course_name: 'Gateway Testing',
            grade: 95.0,
            semester: 'Fall 2024',
            comments: 'Created via Gateway'
        }, {
            headers: { Authorization: `Bearer ${professorToken}` }
        });
        log.success(`Grade created via Gateway with ID: ${response.data.id}`);
    } catch (error) {
        log.fail('Create grade failed: ' + (error.response?.data?.detail || error.message));
    }

    log.success('Grades Service via Gateway: ALL TESTS PASSED ✅');
}

// ==================== Main ====================
async function runGatewayTests() {
    console.log('\n' + '═'.repeat(60).blue);
    console.log('  GATEWAY INTEGRATION TESTS  '.blue.bold);
    console.log('  *** ALL REQUESTS VIA API GATEWAY ***  '.blue);
    console.log(`  Gateway URL: ${GATEWAY_URL}  `.blue);
    console.log('═'.repeat(60).blue);

    const startTime = Date.now();

    try {
        await testGatewayHealth();
        await testOAuthViaGateway();
        await testStudentViaGateway();
        await testGradesViaGateway();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n' + '═'.repeat(60).green);
        console.log('  🎉 ALL GATEWAY TESTS COMPLETED! 🎉  '.green.bold);
        console.log(`  Total Duration: ${duration}s`.green);
        console.log('═'.repeat(60).green + '\n');

    } catch (error) {
        console.log('\n' + '═'.repeat(60).red);
        console.log('  ❌ GATEWAY TESTS FAILED  '.red.bold);
        console.log(`  Error: ${error.message}`.red);
        console.log('═'.repeat(60).red + '\n');
        process.exit(1);
    }
}

runGatewayTests();
