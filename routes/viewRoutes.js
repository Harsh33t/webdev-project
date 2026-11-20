/**
 * routes/viewRoutes.js
 * Server-Side Rendered (SSR) Views and HTML Page Router
 * 
 * Implements MVC Architecture: Routes define ONLY HTTP paths,
 * delegating template rendering and page resolution to viewController.
 */

const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// User Dashboard View
router.get(['/user-dashboard', '/dashboard'], viewController.renderUserDashboard);

// Authentication View (Login / Signup)
router.get(['/login', '/signup', '/auth'], viewController.renderLogin);

// Server-Side Rendered Mission Control & Telemetry Dashboard (EJS)
router.get('/telemetry', viewController.renderTelemetryDashboard);

module.exports = router;
