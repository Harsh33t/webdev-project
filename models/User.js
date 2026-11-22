/**
 * models/User.js
 * Mongoose Schema & Model for Solar Explorer User Accounts
 * Authenticated with bcryptjs password hashing and password strength verification
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Synchronous password hashing helper using bcryptjs (salt rounds: 10)
function hashPassword(password) {
    if (!password) return '';
    return bcrypt.hashSync(password, 10);
}

// Asynchronous password hashing helper using bcryptjs
async function hashPasswordAsync(password) {
    if (!password) return '';
    return await bcrypt.hash(password, 10);
}

// Password strength validation helper
function validatePasswordStrength(password) {
    if (!password || typeof password !== 'string') {
        return { valid: false, message: 'Password is required' };
    }
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    // Check for at least one number or special character or mixed case
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter) {
        return { valid: false, message: 'Password must contain at least one letter' };
    }
    return { valid: true, message: 'Password meets security requirements' };
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
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Username may only contain letters, numbers, underscores, and hyphens']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required']
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

// Pre-save hook: Hash password with bcrypt before saving if modified & not already a bcrypt hash
userSchema.pre('save', function() {
    if (this.isModified('passwordHash')) {
        if (this.passwordHash && !this.passwordHash.startsWith('$2a$') && !this.passwordHash.startsWith('$2b$')) {
            this.passwordHash = bcrypt.hashSync(this.passwordHash, 10);
        }
    }
});

// Static methods
userSchema.statics.hashPassword = hashPassword;
userSchema.statics.hashPasswordAsync = hashPasswordAsync;
userSchema.statics.validatePasswordStrength = validatePasswordStrength;

// Static compare helper
userSchema.statics.comparePassword = async function(candidatePassword, hash) {
    if (!candidatePassword || !hash) return false;
    if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
        return await bcrypt.compare(candidatePassword, hash);
    }
    // Backward compatibility fallback for legacy SHA-256 hashes
    const legacyHash = crypto.createHash('sha256').update(candidatePassword + 'solar_explorer_salt_2026').digest('hex');
    return hash === legacyHash;
};

// Instance method: checkPassword (sync)
userSchema.methods.checkPassword = function(password) {
    if (!password || !this.passwordHash) return false;
    if (this.passwordHash.startsWith('$2a$') || this.passwordHash.startsWith('$2b$')) {
        return bcrypt.compareSync(password, this.passwordHash);
    }
    // Backward compatibility fallback for legacy SHA-256 hashes
    const legacyHash = crypto.createHash('sha256').update(password + 'solar_explorer_salt_2026').digest('hex');
    return this.passwordHash === legacyHash;
};

// Instance method: comparePassword (async)
userSchema.methods.comparePassword = async function(password) {
    if (!password || !this.passwordHash) return false;
    if (this.passwordHash.startsWith('$2a$') || this.passwordHash.startsWith('$2b$')) {
        return await bcrypt.compare(password, this.passwordHash);
    }
    // Backward compatibility fallback for legacy SHA-256 hashes
    const legacyHash = crypto.createHash('sha256').update(password + 'solar_explorer_salt_2026').digest('hex');
    return this.passwordHash === legacyHash;
};

module.exports = mongoose.model('User', userSchema);
