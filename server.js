/**
 * Solar Explorer - Local Development & JSON Data Persistence Server
 * 
 * Zero external dependencies (uses Node.js built-in http, fs, path).
 * Serves static web assets and writes live form submissions directly
 * into data/feedback.json and data/merchandise.json inside the IDE.
 * 
 * Usage:
 *   node server.js
 * Open:
 *   http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const MERCH_FILE = path.join(DATA_DIR, 'merchandise.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, '[]', 'utf8');
}
if (!fs.existsSync(MERCH_FILE)) {
    fs.writeFileSync(MERCH_FILE, '[]', 'utf8');
}

// MIME types dictionary for static file serving
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.txt': 'text/plain; charset=UTF-8'
};

// Helper to append JSON record safely
function appendJsonRecord(filePath, newRecord) {
    let list = [];
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            list = JSON.parse(raw);
            if (!Array.isArray(list)) list = [];
        }
    } catch (err) {
        list = [];
    }
    list.push(newRecord);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
    return list;
}

// Helper to parse incoming JSON request body
function parseJsonBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
        // Prevent flood attacks (> 1MB)
        if (body.length > 1e6) req.destroy();
    });
    req.on('end', () => {
        try {
            const parsed = JSON.parse(body || '{}');
            callback(null, parsed);
        } catch (err) {
            callback(err, null);
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // Enable CORS for flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // ==========================================
    // API Endpoint: POST /api/feedback
    // ==========================================
    if (pathname === '/api/feedback' && req.method === 'POST') {
        parseJsonBody(req, (err, payload) => {
            if (err || !payload) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                return;
            }

            const updatedList = appendJsonRecord(FEEDBACK_FILE, payload);
            console.log(`[IDE Storage] Feedback received and written to data/feedback.json: ID ${payload.id || 'N/A'}`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Feedback saved directly to data/feedback.json in IDE workspace',
                totalRecords: updatedList.length,
                savedRecord: payload
            }));
        });
        return;
    }

    // ==========================================
    // API Endpoint: GET /api/feedback
    // ==========================================
    if (pathname === '/api/feedback' && req.method === 'GET') {
        const raw = fs.readFileSync(FEEDBACK_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(raw);
        return;
    }

    // ==========================================
    // API Endpoint: POST /api/merchandise
    // ==========================================
    if (pathname === '/api/merchandise' && req.method === 'POST') {
        parseJsonBody(req, (err, payload) => {
            if (err || !payload) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                return;
            }

            const updatedList = appendJsonRecord(MERCH_FILE, payload);
            console.log(`[IDE Storage] Merchandise Pre-order received and written to data/merchandise.json: ID ${payload.id || 'N/A'}`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Pre-order saved directly to data/merchandise.json in IDE workspace',
                totalRecords: updatedList.length,
                savedRecord: payload
            }));
        });
        return;
    }

    // ==========================================
    // API Endpoint: GET /api/merchandise
    // ==========================================
    if (pathname === '/api/merchandise' && req.method === 'GET') {
        const raw = fs.readFileSync(MERCH_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(raw);
        return;
    }

    // ==========================================
    // Static File Serving
    // ==========================================
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log('================================================================');
    console.log(`🚀 Solar Explorer Server running at: http://localhost:${PORT}`);
    console.log(`📁 Direct IDE Storage Files:`);
    console.log(`   - Feedback:    data/feedback.json`);
    console.log(`   - Merchandise: data/merchandise.json`);
    console.log(`💡 All browser submissions write directly to these JSON files!`);
    console.log('================================================================');
});
