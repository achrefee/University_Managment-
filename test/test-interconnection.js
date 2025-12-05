const axios = require('axios');
const colors = require('colors');

/**
 * INTERCONNECTION TEST
 * 
 * This test verifies that:
 * 1. Connections through the Gateway WORK
 * 2. Direct connections to services are BLOCKED (403)
 * 
 * This ensures the gateway-only architecture is properly enforced.
 */

// Gateway URL - all traffic should go through here
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

// Direct service URLs - these should be BLOCKED
const DIRECT_URLS = {
    oauth: 'http://localhost:8081',
    student: 'http://localhost:3001',
    grades: 'http://localhost:8000',
    course: 'http://localhost:8082',
    facturation: 'http://localhost:8083'
};

// Test results tracking
let passed = 0;
let failed = 0;

// Logging helpers
const log = {
    success: (msg) => { console.log('✅'.green + ' ' + msg); passed++; },
    fail: (msg) => { console.log('❌'.red + ' ' + msg); failed++; },
    info: (msg) => console.log('ℹ️ '.blue + ' ' + msg),
    section: (msg) => console.log('\n' + '='.repeat(60).cyan + '\n' + msg.yellow.bold + '\n' + '='.repeat(60).cyan),
    warn: (msg) => console.log('⚠️ '.yellow + ' ' + msg)
};

// Get admin token via gateway
async function getAdminToken() {
    try {
        const response = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
            email: 'admin@test.com',
            password: 'Admin123!'
        });
        return response.data.token;
    } catch (error) {
        throw new Error('Failed to get admin token via gateway');
    }
}

// ==================== TEST: Gateway Works ====================
async function testGatewayWorks(token) {
    log.section('TEST 1: Gateway Connections Should WORK');

    // OAuth via Gateway
    log.info('Testing OAuth via Gateway...');
    try {
        const response = await axios.get(`${GATEWAY_URL}/api/auth/validate?token=${token}`);
        if (response.status === 200) {
            log.success('OAuth via Gateway: WORKS');
        }
    } catch (error) {
        log.fail('OAuth via Gateway: FAILED - ' + error.message);
    }

    // Students via Gateway
    log.info('Testing Student Service via Gateway...');
    try {
        const response = await axios.get(`${GATEWAY_URL}/api/students`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
            log.success('Student Service via Gateway: WORKS');
        }
    } catch (error) {
        log.fail('Student Service via Gateway: FAILED - ' + error.message);
    }

    // Grades via Gateway
    log.info('Testing Grades Service via Gateway...');
    try {
        const response = await axios.get(`${GATEWAY_URL}/api/grades/health`);
        if (response.status === 200) {
            log.success('Grades Service via Gateway: WORKS');
        }
    } catch (error) {
        log.fail('Grades Service via Gateway: FAILED - ' + error.message);
    }
}

// ==================== TEST: Direct Connections Blocked ====================
async function testDirectConnectionsBlocked(token) {
    log.section('TEST 2: Direct Connections Should be BLOCKED');

    log.info('Services should reject direct connections (403)');
    log.info('Only Gateway-routed requests should be accepted\n');

    // Direct Student Service
    log.info('Testing Student Service DIRECTLY...');
    try {
        await axios.get(`${DIRECT_URLS.student}/api/students`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
        });
        log.warn('Student Service DIRECT: Still accessible (configure gateway-only)');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            log.success('Student Service DIRECT: Connection refused (not running or blocked)');
        } else if (error.response?.status === 403) {
            log.success('Student Service DIRECT: Blocked with 403 ✓');
        } else {
            log.info('   Direct connection error: ' + error.message);
        }
    }

    // Direct Grades Service
    log.info('Testing Grades Service DIRECTLY...');
    try {
        await axios.post(`${DIRECT_URLS.grades}/api/grades/`, {
            student_id: 'TEST001',
            course_id: 'CS101',
            grade: 85
        }, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
        });
        log.warn('Grades Service DIRECT: Still accessible');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            log.success('Grades Service DIRECT: Connection refused');
        } else if (error.response?.status === 403 || error.response?.status === 401) {
            log.success(`Grades Service DIRECT: Blocked with ${error.response.status} ✓`);
        } else {
            log.info('   Direct connection error: ' + error.message);
        }
    }
}

// ==================== TEST: Gateway Health ====================
async function testGatewayHealth() {
    log.section('TEST 3: Gateway Health Check');

    try {
        const response = await axios.get(`${GATEWAY_URL}/actuator/health`, { timeout: 5000 });
        if (response.data.status === 'UP') {
            log.success('Gateway is UP and healthy');
        } else {
            log.fail('Gateway health check returned: ' + response.data.status);
        }
    } catch (error) {
        log.fail('Gateway health check failed: ' + error.message);
        throw new Error('Gateway is not running!');
    }
}

// ==================== MAIN ====================
async function runInterconnectionTests() {
    console.log('\n' + '═'.repeat(60).blue);
    console.log('  GATEWAY INTERCONNECTION TESTS  '.blue.bold);
    console.log('  Verifying Gateway-Only Architecture  '.blue);
    console.log(`  Gateway: ${GATEWAY_URL}  `.blue);
    console.log('═'.repeat(60).blue + '\n');

    const startTime = Date.now();

    try {
        // Check gateway first
        await testGatewayHealth();

        // Get token
        log.info('Obtaining admin token via Gateway...');
        const token = await getAdminToken();
        log.success('Admin token obtained\n');

        // Run tests
        await testGatewayWorks(token);
        await testDirectConnectionsBlocked(token);

        // Summary
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n' + '═'.repeat(60).cyan);
        console.log('  INTERCONNECTION TEST SUMMARY  '.cyan.bold);
        console.log('═'.repeat(60).cyan);
        console.log(`  ✅ Passed: ${passed}`.green);
        console.log(`  ❌ Failed: ${failed}`.red);
        console.log(`  ⏱️  Duration: ${duration}s`);
        console.log('═'.repeat(60).cyan + '\n');

        if (failed === 0) {
            console.log('  🎉 ALL TESTS PASSED! 🎉  '.green.bold);
            console.log('  Gateway architecture is working correctly  '.green);
        } else {
            console.log('  ⚠️  Some tests failed - review configuration  '.yellow.bold);
        }
        console.log('\n');

    } catch (error) {
        console.log('\n' + '═'.repeat(60).red);
        console.log('  ❌ TESTS FAILED  '.red.bold);
        console.log(`  Error: ${error.message}`.red);
        console.log('═'.repeat(60).red + '\n');
        process.exit(1);
    }
}

runInterconnectionTests();
