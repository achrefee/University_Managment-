const { MongoClient } = require('mongodb');

async function cleanupDatabase() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db('university_oauth');

        // List all collections
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log('Found collections:', collectionNames);

        // Drop stale collections
        if (collectionNames.includes('students')) {
            await db.collection('students').drop();
            console.log('🗑️  Dropped "students" collection');
        }

        if (collectionNames.includes('professors')) {
            await db.collection('professors').drop();
            console.log('🗑️  Dropped "professors" collection');
        }

        if (collectionNames.includes('admins')) {
            await db.collection('admins').drop();
            console.log('🗑️  Dropped "admins" collection');
        }

        // Also remove the specific test users from 'users' collection to allow fresh registration
        await db.collection('users').deleteMany({
            email: { $in: ['student@test.com', 'professor@test.com', 'admin@test.com'] }
        });
        console.log('🗑️  Removed test users from "users" collection');

        console.log('✨ Cleanup complete! Now run "npm test" again.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

cleanupDatabase();
