/**
 * routes/apiRoutes.js
 * Clean REST API Router for Solar Explorer
 * 
 * Implements MVC Architecture: Routes define ONLY HTTP verbs and URL paths,
 * delegating business logic and database execution entirely to controllers.
 */

const express = require('express');
const router = express.Router();

// Import MVC Controllers
const feedbackController = require('../controllers/feedbackController');
const orderController = require('../controllers/orderController');
const satelliteController = require('../controllers/satelliteController');
const quizController = require('../controllers/quizController');
const telemetryController = require('../controllers/telemetryController');
const authController = require('../controllers/authController');
const observationRoutes = require('./observationRoutes');
const observationController = require('../controllers/observationController');

// ====================================================
// 1. USER AUTHENTICATION & PROFILES
// ====================================================
router.post(['/auth/signup', '/auth/register'], authController.signup);
router.post('/auth/login', authController.login);
router.get(['/auth/me', '/auth/current-user'], authController.getCurrentUser);
router.post('/auth/logout', authController.logout);
router.get('/auth/user/:username', authController.getUserProfile);
router.post('/auth/user/:username/link-order', authController.linkOrder);
router.post('/auth/user/:username/update-stats', authController.updateStats);

// ====================================================
// 2. CELESTIAL OBSERVATIONS (CRUD OPERATIONS)
// ====================================================
router.post('/observations', observationController.createObservation);
router.get('/observations', observationController.getAllObservations);
router.get('/observations/:id', observationController.getObservationById);
router.patch('/observations/:id', observationController.updateObservation);
router.put('/observations/:id', observationController.updateObservation);
router.delete('/observations/:id', observationController.deleteObservation);

// ====================================================
// 3. E-COMMERCE & ORDERS APIS
// ====================================================
router.get('/products', telemetryController.getProducts);
router.post('/orders', orderController.createOrder);
router.post('/merchandise/checkout', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.get('/orders/:id/receipt', orderController.getOrderReceipt);
router.patch('/orders/:id/status', orderController.updateOrderStatus);
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Merchandise VIP Pre-orders
// IMPORTANT: /merchandise/stats MUST be defined before /merchandise/:id to avoid Express matching "stats" as :id
router.get('/merchandise/stats', orderController.getMerchandiseStats);
router.get('/merchandise', orderController.getMerchandise);
router.post('/merchandise', orderController.createMerchandise);
router.get('/merchandise/:id', orderController.getMerchandiseById);
router.delete('/merchandise/:id', orderController.deleteMerchandise);

// ====================================================
// 4. ORBITAL SATELLITES & SPACE WEATHER APIS
// ====================================================
router.get('/satellites/catalog', satelliteController.getCatalog);
router.get('/satellites/telemetry/iss', satelliteController.getIssTelemetry);
router.get('/satellites/passes', satelliteController.handlePassPrediction);
router.get('/satellites/:id/passes', satelliteController.handlePassPrediction);
router.get('/satellites/watchlist', satelliteController.getWatchlist);
router.post('/satellites/watchlist', satelliteController.addWatchlist);
router.delete('/satellites/watchlist/:noradId', satelliteController.deleteWatchlist);
router.get('/space-weather', telemetryController.getSpaceWeather);
router.get('/daily-fact', telemetryController.getDailyFact);

// ====================================================
// 5. COMMUNITY FEEDBACK & GAMIFIED QUIZ APIS
// ====================================================
router.get('/feedback', feedbackController.getFeedbacks);
router.post('/feedback', feedbackController.submitFeedback);
router.delete('/feedback/:id', feedbackController.deleteFeedback);
router.get('/quiz', quizController.getQuizQuestions);
router.get('/quiz/leaderboard', quizController.getLeaderboard);
router.post('/quiz/submit', quizController.submitQuizScore);

// System Telemetry Diagnostic API
router.get('/telemetry', telemetryController.getSystemTelemetry);

module.exports = router;
