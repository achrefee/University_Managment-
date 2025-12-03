const axios = require('axios');

async function checkOAuthService() {
    console.log('🔍 Checking OAuth Service...\n');

    // Check if service is running
    try {
        const response = await axios.get('http://localhost:8081');
        console.log('✅ OAuth service is running on port 8081');
        console.log(`Response: ${response.status} ${response.statusText}\n`);
    } catch (error) {
        console.log('❌ OAuth service is NOT running on port 8081');
        console.log(`Error: ${error.message}\n`);
        console.log('Please start the OAuth service first:');
        console.log('  cd oauth_service/oauth');
        console.log('  mvn spring-boot:run\n');
        return;
    }

    // Try to register a test user
    try {
        console.log('📝 Attempting to register test admin...');
        const registerData = {
            email: 'testadmin@test.com',
            password: 'Admin123!',
            firstName: 'Test',
            lastName: 'Admin',
            role: 'ADMIN',
            department: 'IT'
        };

        const registerResponse = await axios.post(
            'http://localhost:8081/api/auth/register',
            registerData
        );
        console.log('✅ Registration successful');
        console.log(`Response: ${JSON.stringify(registerResponse.data, null, 2)}\n`);
    } catch (error) {
        if (error.response?.status === 400) {
            console.log('ℹ️  User already exists (this is OK)\n');
        } else {
            console.log('❌ Registration failed');
            console.log(`Status: ${error.response?.status}`);
            console.log(`Error: ${JSON.stringify(error.response?.data, null, 2)}\n`);
            return;
        }
    }

    // Try to login
    try {
        console.log('🔐 Attempting to login...');
        const loginResponse = await axios.post(
            'http://localhost:8081/api/auth/login',
            {
                email: 'testadmin@test.com',
                password: 'Admin123!'
            }
        );
        console.log('✅ Login successful!');
        console.log(`Token: ${loginResponse.data.accessToken.substring(0, 50)}...\n`);
        console.log('🎉 OAuth service is working correctly!\n');
    } catch (error) {
        console.log('❌ Login failed');
        console.log(`Status: ${error.response?.status}`);
        console.log(`Error: ${JSON.stringify(error.response?.data, null, 2)}\n`);

        console.log('💡 Troubleshooting:');
        console.log('  1. Make sure OAuth service is running');
        console.log('  2. Check MongoDB is running on localhost:27017');
        console.log('  3. Check OAuth service logs for errors\n');
    }
}

checkOAuthService();
