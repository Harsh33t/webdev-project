/**
 * controllers/authController.js
 * Controller handling user authentication, registration, session lifecycle,
 * order linkage, and profile statistics for Solar Explorer.
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const StorageService = require('../services/storageService');
const User = require('../models/User');

/**
 * Register a new user account
 * - Validates username (>= 3 chars), email format, and password strength (>= 6 chars)
 * - Checks for existing username
 * - Hashes password using bcryptjs
 * - Stores in MongoDB with fallback to data/users.json
 * - Returns HTTP 201 with safe user object (no passwordHash)
 */
const register = async (req, res) => {
    try {
        const { username, password, displayName, email } = req.body;

        // 1. Username validation
        if (!username || typeof username !== 'string' || !username.trim()) {
            return res.status(400).json({ success: false, error: 'Username is required.' });
        }
        const trimmedUsername = username.trim();
        if (trimmedUsername.length < 3) {
            return res.status(400).json({ success: false, error: 'Username must be at least 3 characters.' });
        }
        if (trimmedUsername.length > 30) {
            return res.status(400).json({ success: false, error: 'Username cannot exceed 30 characters.' });
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
            return res.status(400).json({ success: false, error: 'Username may only contain letters, numbers, underscores, and hyphens.' });
        }

        // 2. Password validation and strength
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ success: false, error: 'Password is required.' });
        }
        const strength = User.validatePasswordStrength ? User.validatePasswordStrength(password) : { valid: password.length >= 6 };
        if (!strength.valid) {
            return res.status(400).json({ success: false, error: strength.message || 'Password must be at least 6 characters.' });
        }

        // 3. Email validation (if provided)
        const trimmedEmail = (email || '').trim().toLowerCase();
        if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
        }

        // 4. Check for existing username
        const existing = await StorageService.getUserByUsername(trimmedUsername);
        if (existing) {
            return res.status(409).json({ success: false, error: 'Username already taken. Please choose another.' });
        }

        // 5. Bcrypt password hashing (10 salt rounds)
        const passwordHash = await bcrypt.hash(password, 10);

        // 6. User object assembly
        const newUser = {
            userId: 'USR-' + Date.now(),
            username: trimmedUsername,
            passwordHash,
            displayName: (displayName || trimmedUsername).trim(),
            email: trimmedEmail,
            orderIds: [],
            achievements: ['First Launch 🚀'],
            stats: {
                quizzesTaken: 0,
                totalSpent: 0,
                pagesVisited: [],
                feedbackSubmitted: 0
            },
            joinedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
        };

        // 7. Save user in MongoDB (with automatic fallback to data/users.json via StorageService)
        const created = await StorageService.createUser(newUser);

        // 8. Omit sensitive credentials from response
        const safeUser = created && created.toObject ? created.toObject() : { ...created };
        delete safeUser.passwordHash;
        delete safeUser.__v;

        // 9. Generate session token
        const token = 'SES-' + crypto.randomBytes(24).toString('hex');
        if (req.session) {
            req.session.user = safeUser;
            req.session.token = token;
        }

        return res.status(201).json({
            success: true,
            message: 'Account created! Welcome to Solar Explorer.',
            token,
            user: safeUser
        });
    } catch (err) {
        console.error('[authController.register] Error:', err);
        return res.status(500).json({ success: false, error: 'Failed to create user account.' });
    }
};

/**
 * Log in an existing user
 * - Validates credentials input
 * - Finds user by username
 * - Compares password with bcrypt.compare
 * - Updates lastLoginAt timestamp
 * - Returns HTTP 200 with user session / token data, or 400/401 for failures
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password are required.' });
        }

        const trimmedUsername = String(username).trim();
        const user = await StorageService.getUserByUsername(trimmedUsername);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        // Compare password via bcrypt
        let isMatch = false;
        if (user.passwordHash && (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$'))) {
            isMatch = await bcrypt.compare(password, user.passwordHash);
        } else if (user.passwordHash) {
            // Backward compatibility for existing SHA-256 legacy hashes
            const legacyHash = crypto.createHash('sha256').update(password + 'solar_explorer_salt_2026').digest('hex');
            if (user.passwordHash === legacyHash) {
                isMatch = true;
                // Seamlessly upgrade legacy hash to bcrypt
                const newHash = await bcrypt.hash(password, 10);
                await StorageService.updateUser(user.username, { passwordHash: newHash });
            }
        }

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        // Update last login timestamp
        const lastLoginAt = new Date().toISOString();
        await StorageService.updateUser(user.username, { lastLoginAt });

        // Build safe response user
        const safeUser = user && user.toObject ? user.toObject() : { ...user };
        delete safeUser.passwordHash;
        delete safeUser.__v;
        safeUser.lastLoginAt = lastLoginAt;

        // Session & token generation
        const token = 'SES-' + crypto.randomBytes(24).toString('hex');
        if (req.session) {
            req.session.user = safeUser;
            req.session.token = token;
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful! Welcome back.',
            token,
            user: safeUser
        });
    } catch (err) {
        console.error('[authController.login] Error:', err);
        return res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
    }
};

/**
 * Log out user / terminate session
 * - Clears session and cookies
 * - Returns HTTP 200 with success status
 */
const logout = async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy(err => {
                if (err) console.warn('[authController.logout] Session destruction warning:', err.message);
            });
        }
        res.clearCookie('connect.sid');
        res.clearCookie('solar_session');

        return res.status(200).json({
            success: true,
            message: 'Session terminated successfully. Safe travels!'
        });
    } catch (err) {
        console.error('[authController.logout] Error:', err);
        return res.status(500).json({ success: false, error: 'Failed to terminate session.' });
    }
};

/**
 * Fetch profile details for a specific user
 * - Returns user details, linked orders, achievements, and stats
 */
const getUserProfile = async (req, res) => {
    try {
        const username = req.params.username || req.query.username;
        if (!username) {
            return res.status(400).json({ success: false, error: 'Username parameter is required.' });
        }

        const user = await StorageService.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        // Fetch user's orders
        const allOrders = StorageService.readJsonPublic ? StorageService.readJsonPublic('orders') : [];
        const userOrderIds = Array.isArray(user.orderIds) ? user.orderIds : [];
        const userOrders = allOrders.filter(o =>
            userOrderIds.includes(o.orderId) ||
            (o.username && o.username.toLowerCase() === user.username.toLowerCase()) ||
            (o.customer && o.customer.email && user.email && o.customer.email.toLowerCase() === user.email.toLowerCase())
        );

        const safeUser = user && user.toObject ? user.toObject() : { ...user };
        delete safeUser.passwordHash;
        delete safeUser.__v;

        return res.status(200).json({
            success: true,
            user: safeUser,
            orders: userOrders
        });
    } catch (err) {
        console.error('[authController.getUserProfile] Error:', err);
        return res.status(500).json({ success: false, error: 'Failed to load user profile.' });
    }
};

/**
 * Fetch current authenticated user's profile
 */
const getMe = async (req, res) => {
    try {
        const username = (req.session && req.session.user && req.session.user.username) ||
                         req.headers['x-user-username'] ||
                         req.query.username;

        if (!username) {
            return res.status(401).json({ success: false, error: 'Not authenticated. No active session found.' });
        }

        req.params.username = username;
        return getUserProfile(req, res);
    } catch (err) {
        console.error('[authController.getMe] Error:', err);
        return res.status(500).json({ success: false, error: 'Failed to retrieve current user session.' });
    }
};

/**
 * Link an order ID to user profile
 */
const linkOrder = async (req, res) => {
    try {
        const username = req.params.username || req.body.username;
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, error: 'orderId is required.' });
        }
        if (!username) {
            return res.status(400).json({ success: false, error: 'Username is required.' });
        }

        const user = await StorageService.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        const orders = StorageService.readJsonPublic ? StorageService.readJsonPublic('orders') : [];
        const order = orders.find(o => o.orderId === orderId);
        const amount = order ? order.totalAmount : (Number(req.body.amount) || 0);

        await StorageService.linkUserOrder(user.username, orderId, amount);
        const updated = await StorageService.getUserByUsername(user.username);
        const safeUser = updated && updated.toObject ? updated.toObject() : { ...updated };
        delete safeUser.passwordHash;
        delete safeUser.__v;

        return res.status(200).json({
            success: true,
            message: `Order ${orderId} linked successfully to user ${user.username}.`,
            user: safeUser
        });
    } catch (err) {
        console.error('[authController.linkOrder] Error:', err);
        return res.status(500).json({ success: false, error: 'Failed to link order.' });
    }
};

/**
 * Update user statistics and achievements (quiz, page visits, feedback)
 */
const updateStats = async (req, res) => {
    try {
        const username = req.params.username || req.body.username;
        const { quizScore, pageVisited, feedbackSubmitted } = req.body;

        if (!username) {
            return res.status(400).json({ success: false, error: 'Username is required.' });
        }

        const user = await StorageService.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        const stats = user.stats || { quizzesTaken: 0, totalSpent: 0, pagesVisited: [], feedbackSubmitted: 0 };
        const achievements = Array.isArray(user.achievements) ? [...user.achievements] : [];

        if (quizScore !== undefined) {
            stats.quizzesTaken = (stats.quizzesTaken || 0) + 1;
            if (quizScore >= 500 && !achievements.includes('Quiz Master 🏆')) {
                achievements.push('Quiz Master 🏆');
            } else if (quizScore >= 300 && !achievements.includes('Star Student ⭐')) {
                achievements.push('Star Student ⭐');
            }
        }
        if (pageVisited) {
            if (!Array.isArray(stats.pagesVisited)) stats.pagesVisited = [];
            if (!stats.pagesVisited.includes(pageVisited)) {
                stats.pagesVisited.push(pageVisited);
                if (stats.pagesVisited.length >= 5 && !achievements.includes('Explorer 🔭')) {
                    achievements.push('Explorer 🔭');
                }
            }
        }
        if (feedbackSubmitted) {
            stats.feedbackSubmitted = (stats.feedbackSubmitted || 0) + 1;
            if (!achievements.includes('Community Voice 💬')) {
                achievements.push('Community Voice 💬');
            }
        }

        await StorageService.updateUser(user.username, { stats, achievements });
        const updated = await StorageService.getUserByUsername(user.username);
        const safeUser = updated && updated.toObject ? updated.toObject() : { ...updated };
        delete safeUser.passwordHash;
        delete safeUser.__v;

        return res.status(200).json({
            success: true,
            message: 'User stats updated successfully.',
            user: safeUser
        });
    } catch (err) {
        console.error('[authController.updateStats] Error:', err);
        return res.status(500).json({ success: false, error: 'Failed to update stats.' });
    }
};

module.exports = {
    register,
    signup: register,
    login,
    logout,
    getUserProfile,
    getMe,
    getCurrentUser: getMe,
    linkOrder,
    updateStats
};
