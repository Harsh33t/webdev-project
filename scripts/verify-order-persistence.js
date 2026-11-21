/**
 * scripts/verify-order-persistence.js
 * Verifies that orders are written to disk and can be retrieved via /api/merch/orders/:id.
 */
const http = require('http');

http.get('http://localhost:3000/api/merch/orders/ORD-2026-3185', res => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(raw);
            console.log('Order status:', json.success ? 'VERIFIED' : 'FAILED', json.data?.orderId);
        } catch (e) {
            console.error('Parse error:', e);
        }
    });
});
