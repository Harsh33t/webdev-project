/**
 * controllers/viewController.js
 * Controller handling server-rendered EJS views and static page views.
 * Part of Solar Explorer MVC Architecture.
 */
const path = require('path');
const StorageService = require('../services/storageService');
const { getDatabaseStatus } = require('../config/db');

/**
 * Serve user dashboard HTML page
 * GET /user-dashboard or /dashboard
 */
function renderUserDashboard(req, res) {
    res.sendFile(path.join(__dirname, '..', 'user-dashboard.html'));
}

/**
 * Serve authentication / login HTML page
 * GET /login, /signup, or /auth
 */
function renderLogin(req, res) {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
}

/**
 * Render Mission Control Telemetry SSR EJS View
 * GET /telemetry
 */
async function renderTelemetryDashboard(req, res) {
    try {
        const stats = await StorageService.getSystemStats();
        const dbStatus = getDatabaseStatus();
        const feedbacks = await StorageService.getFeedbacks();
        const merchandise = await StorageService.getMerchandise();
        const satellites = await StorageService.getSatelliteTracks();
        const quizScores = await StorageService.getQuizScores(10);

        // Fetch or simulate live telemetry for ISS
        let issData = {
            latitude: 28.57,
            longitude: -80.65,
            altitudeKm: 420.5,
            velocityKmh: 27600,
            visibility: 'daylight'
        };

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            const issRes = await fetch('https://api.wheretheiss.at/v1/satellites/25544', {
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (issRes.ok) {
                const live = await issRes.json();
                issData = {
                    latitude: Number(live.latitude.toFixed(4)),
                    longitude: Number(live.longitude.toFixed(4)),
                    altitudeKm: Number(live.altitude.toFixed(1)),
                    velocityKmh: Number(live.velocity.toFixed(1)),
                    visibility: live.visibility || 'daylight'
                };
            }
        } catch {
            // Keep default resilient values
        }

        res.render('dashboard', {
            pageTitle: 'Mission Control Telemetry & Database Hub',
            activeNav: 'telemetry',
            serverTime: new Date().toUTCString(),
            dbStatus,
            stats,
            issData,
            recentFeedbacks: feedbacks.slice(0, 8),
            recentOrders: merchandise.slice(0, 8),
            satellites,
            topScores: quizScores,
            team: [
                { name: 'Aviraj', role: 'Full-Stack Lead & Engine Architect' },
                { name: 'Harsheet', role: 'Data Structures & Schema Specialist' },
                { name: 'Pratham', role: 'Orbital Telemetry & Interactive Designer' },
                { name: 'Samarth', role: 'API Routing & Systems Integrator' },
                { name: 'Shivansh', role: 'Testing, Quality Assurance & Security' }
            ]
        });
    } catch (err) {
        console.error('[viewController] Error rendering telemetry dashboard view:', err);
        res.status(500).send(`
            <div style="background:#0b0d17; color:#fff; font-family:sans-serif; padding:40px; text-align:center;">
                <h1 style="color:#ef4444;">Mission Control Telemetry Error</h1>
                <p>Failed to execute template engine renderer: ${err.message}</p>
                <a href="/" style="color:#38bdf8; text-decoration:none;">Return to Solar Explorer Home</a>
            </div>
        `);
    }
}

module.exports = {
    renderUserDashboard,
    renderLogin,
    renderTelemetryDashboard
};
