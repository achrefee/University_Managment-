const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Support both MONGO_URI (local) and MONGODB_URI (Docker)
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MongoDB URI is not defined. Set MONGO_URI or MONGODB_URI environment variable.');
        }

        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
