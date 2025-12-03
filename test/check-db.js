// Simple script to check MongoDB for registered users
const { MongoClient } = require('mongodb');

async function checkUsers() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');

        const db = client.db('university_oauth');
        const users = db.collection('users');

        // Find the admin user
        const admin = await users.findOne({ email: 'admin@test.com' });

        if (admin) {
            console.log('✅ Admin user found in database:');
            console.log('   Email:', admin.email);
            console.log('   Role:', admin.role);
        } else {
            console.log('❌ Admin user NOT found in database');
        }

        // Find the student user
        const student = await users.findOne({ email: 'student@test.com' });

        if (student) {
            console.log('✅ Student user found in users collection:');
            console.log('   Email:', student.email);
            console.log('   Role:', student.role);
        } else {
            console.log('❌ Student user NOT found in users collection');

            // Check students collection specifically
            const studentsCollection = db.collection('students');
            const studentInStudents = await studentsCollection.findOne({ email: 'student@test.com' });

            if (studentInStudents) {
                console.log('⚠️  Student found in "students" collection (Old schema!)');
                console.log('   This means the service is still using the old mapping or data is stale.');
            } else {
                console.log('❌ Student not found in "students" collection either');
            }
        }

        // Count all users
        const count = await users.countDocuments();
        console.log(`\n📊 Total users in database: ${count}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

checkUsers();
