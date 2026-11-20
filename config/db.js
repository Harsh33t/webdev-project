/**
 * config/db.js - Resilient MongoDB Connection Manager
 * 
 * Supports both:
 *   1. Local MongoDB instances (mongodb://127.0.0.1:27017/...)
 *   2. MongoDB Atlas Cloud clusters (mongodb+srv://...)
 * 
 * Features:
 *   - Modern Mongoose connection options (IPv4 family, fast timeout fallback)
 *   - Graceful resilience: If MongoDB or Atlas is offline or credentials fail,
 *     logs actionable diagnostic messages and triggers the seamless Dual-Storage
 *     local JSON fallback mode without crashing the server.
 *   - Sanitized connection strings (passwords masked in telemetry/logs).
 * 
 * Part of Solar Explorer A3 Full-Stack Architecture
 */

const mongoose = require('mongoose');

let isConnected = false;
let activeUri = '';

/**
 * Mask sensitive credentials in MongoDB connection string for safe logging and telemetry
 * @param {string} uri 
 * @returns {string}
 */
function sanitizeMongoUri(uri) {
    if (!uri) return '';
    try {
        return uri.replace(/(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$3:****@');
    } catch {
        return uri;
    }
}

/**
 * Connect to MongoDB or MongoDB Atlas via Mongoose ODM
 * @returns {Promise<boolean>}
 */
async function connectDB() {
    const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solar_explorer';
    activeUri = rawUri;
    const isAtlas = rawUri.startsWith('mongodb+srv://');
    const sanitized = sanitizeMongoUri(rawUri);

    try {
        mongoose.set('strictQuery', false);

        // Modern Mongoose connection options
        const connectionOptions = {
            serverSelectionTimeoutMS: 3000, // Quick 3s timeout to prevent server hanging when offline
            connectTimeoutMS: 3000,
            socketTimeoutMS: 45000,
            family: 4 // Prefer IPv4 loopback on Windows localhost to avoid delay
        };

        await mongoose.connect(rawUri, connectionOptions);

        isConnected = true;
        console.log(`[Database] MongoDB connected successfully to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB Instance'}: ${sanitized}`);
    } catch (err) {
        isConnected = false;
        console.warn(`========================================================================`);
        console.warn(`[Database Diagnostics] MongoDB Connection Notice:`);
        if (isAtlas) {
            console.warn(`[Database Diagnostics] Failed to connect to MongoDB Atlas Cloud Cluster (${err.message}).`);
            console.warn(`[Database Diagnostics] Troubleshooting Atlas:`);
            console.warn(`  1. Verify cluster connection string in .env (MONGODB_URI).`);
            console.warn(`  2. Ensure IP Access List allows connections (Network Access -> 0.0.0.0/0).`);
            console.warn(`  3. Confirm database user credentials and percent-encoded special characters.`);
        } else {
            console.warn(`[Database Diagnostics] Local MongoDB daemon not active at ${sanitized} (${err.message}).`);
            console.warn(`[Database Diagnostics] To use local MongoDB: start 'mongod' or configure MONGODB_URI in .env.`);
        }
        console.warn(`[Database Diagnostics] -> Activating resilient Dual-Storage local JSON persistence mode (${process.env.STORAGE_FILE_DIR || 'data'}/).`);
        console.warn(`[Database Diagnostics] -> Mission Control Server will run at 100% operational capacity.`);
        console.warn(`========================================================================`);
    }

    // Runtime Lifecycle Event Listeners
    mongoose.connection.on('disconnected', () => {
        isConnected = false;
        console.warn('[Database] MongoDB connection dropped. Operating in Dual-Storage local JSON mode.');
    });

    mongoose.connection.on('reconnected', () => {
        isConnected = true;
        console.log('[Database] MongoDB connection re-established.');
    });

    mongoose.connection.on('error', (err) => {
        isConnected = false;
        console.warn(`[Database] Mongoose connection error: ${err.message}`);
    });

    return isConnected;
}

/**
 * Returns diagnostic metadata regarding active database state
 * @returns {object}
 */
function getDatabaseStatus() {
    const isReady = isConnected && mongoose.connection.readyState === 1;
    const uri = activeUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solar_explorer';
    const isAtlas = uri.startsWith('mongodb+srv://');
    const sanitized = sanitizeMongoUri(uri);

    return {
        connected: isReady,
        mode: isReady ? 'mongodb' : 'json_fallback',
        type: isReady 
            ? (isAtlas ? 'MongoDB Atlas (Cloud Cluster)' : 'Local MongoDB Instance') 
            : 'Dual-Storage Local JSON Fallback',
        target: isAtlas ? 'Atlas Cloud (mongodb+srv)' : 'Localhost (mongodb)',
        uri: sanitized,
        readyState: mongoose.connection.readyState,
        message: isReady
            ? `Connected to ${isAtlas ? 'MongoDB Atlas Cloud Cluster' : 'Local MongoDB Instance'} via Mongoose ODM`
            : 'MongoDB unavailable - Operating in resilient Dual-Storage local JSON fallback mode'
    };
}

module.exports = {
    connectDB,
    connectDatabase: connectDB,
    getDatabaseStatus,
    isMongoActive: () => isConnected && mongoose.connection.readyState === 1,
    sanitizeMongoUri
};
