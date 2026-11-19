/**
 * models/User.js
 * Mongoose Schema & Model for Solar Explorer User Accounts
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

// Simple password hashing using built-in crypto (no extra deps)
function hashPassword(password) {
    return crypto.createHash('sha256').update(password + 'solar_explorer_salt_2026').digest('hex');
}

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    passwordHash: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    // Linked order IDs (references to orders.json / Order collection)
    orderIds: {
        type: [String],
        default: []
    },
    // Achievements earned by user
    achievements: {
        type: [String],
        default: []
    },
    // User stats
    stats: {
        quizzesTaken: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        pagesVisited: { type: [String], default: [] },
        feedbackSubmitted: { type: Number, default: 0 }
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.statics.hashPassword = hashPassword;

userSchema.methods.checkPassword = function(password) {
    return this.passwordHash === hashPassword(password);
};

module.exports = mongoose.model('User', userSchema);

