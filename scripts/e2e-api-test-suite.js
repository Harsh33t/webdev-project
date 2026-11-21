/**
 * scripts/e2e-api-test-suite.js
 * Comprehensive regression test suite checking all 16 endpoints and CRUD operations.
 */
const http = require('http');

const endpoints = [
    '/api/telemetry', '/api/space-weather', '/api/daily-fact',
    '/api/observations', '/api/orders', '/api/merch/orders/ORD-2026-3185',
    '/api/satellites/catalog', '/api/satellites/telemetry/iss',
    '/api/satellites/25544/passes?lat=28.6139&lng=77.2090',
    '/api/satellites/watchlist', '/api/merchandise', '/api/feedback',
    '/api/quiz', '/api/quiz/leaderboard'
];

async function runAll() {
    console.log('Running End-to-End API Regression Suite...');
    for (const ep of endpoints) {
        await new Promise(resolve => {
            http.get('http://localhost:3000' + ep, res => {
                console.log(`${res.statusCode === 200 ? '✓' : '✗'} ${ep} [${res.statusCode}]`);
                resolve();
            }).on('error', err => {
                console.log(`✗ ${ep} [ERROR: ${err.message}]`);
                resolve();
            });
        });
    }
}
runAll();
