/**
 * config/db.js - Resilient MongoDB Connection Manager
 * Part of Solar Explorer A3 Full-Stack Architecture
 */
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solarexplorer';

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2500, // Do not hang server if MongoDB is offline
            connectTimeoutMS: 2500
        });

        isConnected = true;
        console.log(`[Database] MongoDB connected successfully to: ${uri}`);
    } catch (err) {
        isConnected = false;
        console.warn(`[Database] MongoDB offline - operating in JSON persistence fallback mode (${err.message})`);
    }

    // Connection event listeners for runtime status tracking
    mongoose.connection.on('disconnected', () => {
        isConnected = false;
        console.warn('[Database] MongoDB disconnected - falling back to JSON persistence mode');
    });

    mongoose.connection.on('reconnected', () => {
        isConnected = true;
        console.log('[Database] MongoDB reconnected successfully');
    });

    return isConnected;
}

function getDatabaseStatus() {
    const isReady = isConnected && mongoose.connection.readyState === 1;
    return {
        connected: isReady,
        mode: isReady ? 'mongodb' : 'json_fallback',
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solarexplorer',
        readyState: mongoose.connection.readyState,
        message: isReady
            ? 'Connected to MongoDB Atlas / Local MongoDB Daemon via Mongoose ODM'
            : 'MongoDB Daemon offline - Operating in resilient Dual-Storage local JSON fallback mode'
    };
}

module.exports = {
    connectDB,
    connectDatabase: connectDB,
    getDatabaseStatus,
    isMongoActive: () => isConnected && mongoose.connection.readyState === 1
};
