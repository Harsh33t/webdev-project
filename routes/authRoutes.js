/**
 * routes/authRoutes.js
 * Authentication & Security API Routes for Solar Explorer
 * Full REST API endpoints for user registration, login, logout, profile and stats
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. User Registration (supports both /register and /signup)
router.post('/register', authController.register);
router.post('/signup', authController.register);

// 2. User Login
router.post('/login', authController.login);

// 3. User Logout
router.post('/logout', authController.logout);

// 4. Session & User Profile
router.get('/me', authController.getMe);
router.get('/user/:username', authController.getUserProfile);
// NOTE: /:username greedy route is kept but moved after /me and /user/:username
// to prevent intercepting /me or other fixed paths
router.get('/profile/:username', authController.getUserProfile);

// 5. Link Order
router.post('/user/:username/link-order', authController.linkOrder);
router.post('/:username/link-order', authController.linkOrder);

// 6. Update User Stats & Achievements
router.post('/user/:username/update-stats', authController.updateStats);
router.post('/:username/update-stats', authController.updateStats);

module.exports = router;
