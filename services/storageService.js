/**
 * services/storageService.js
 * Dual-Storage Abstraction Layer: Dispatches to Mongoose ODM or Local JSON Files
 * Part of Solar Explorer A3 Full-Stack Architecture
 */
const fs = require('fs');
const path = require('path');
const { isMongoActive } = require('../config/db');

// Mongoose Models
const Feedback = require('../models/Feedback');
const Merchandise = require('../models/Merchandise');
const SatelliteTrack = require('../models/SatelliteTrack');
const QuizScore = require('../models/QuizScore');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const FILE_PATHS = {
    feedback: path.join(DATA_DIR, 'feedback.json'),
    merchandise: path.join(DATA_DIR, 'merchandise.json'),
    satellites: path.join(DATA_DIR, 'satellites.json'),
    quizscores: path.join(DATA_DIR, 'quizscores.json')
};

// Initialize JSON files with defaults if not present
if (!fs.existsSync(FILE_PATHS.feedback)) fs.writeFileSync(FILE_PATHS.feedback, '[]', 'utf8');
if (!fs.existsSync(FILE_PATHS.merchandise)) fs.writeFileSync(FILE_PATHS.merchandise, '[]', 'utf8');
if (!fs.existsSync(FILE_PATHS.satellites)) {
    fs.writeFileSync(FILE_PATHS.satellites, JSON.stringify([
        {
            id: 'SAT-1',
            noradId: 25544,
            name: 'International Space Station (ISS)',
            category: 'Space Station',
            orbitType: 'LEO',
            notes: 'Primary manned orbital laboratory',
            spottedAt: new Date().toISOString(),
            observerLocation: 'Global Ground Station'
        },
        {
            id: 'SAT-2',
            noradId: 20580,
            name: 'Hubble Space Telescope',
            category: 'Space Telescope',
            orbitType: 'LEO',
            notes: 'Flagship optical observatory',
            spottedAt: new Date().toISOString(),
            observerLocation: 'Global Ground Station'
        }
    ], null, 2), 'utf8');
}
if (!fs.existsSync(FILE_PATHS.quizscores)) {
    fs.writeFileSync(FILE_PATHS.quizscores, JSON.stringify([
        {
            id: 'QS-1',
            playerName: 'Commander Shepard',
            score: 500,
            totalQuestions: 5,
            rankTitle: 'Chief Galactic Astronomer',
            category: 'Cosmic Astrophysics',
            completedAt: new Date().toISOString()
        },
        {
            id: 'QS-2',
            playerName: 'Neil Armstrong',
            score: 400,
            totalQuestions: 5,
            rankTitle: 'Senior Flight Director',
            category: 'Cosmic Astrophysics',
            completedAt: new Date().toISOString()
        }
    ], null, 2), 'utf8');
}

// JSON File Helpers
function readJson(key) {
    try {
        const raw = fs.readFileSync(FILE_PATHS[key], 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeJson(key, data) {
    fs.writeFileSync(FILE_PATHS[key], JSON.stringify(data, null, 2), 'utf8');
}

// ----------------------------------------------------
// Unified Storage Service
// ----------------------------------------------------
const StorageService = {
    // ==========================================
    // 1. FEEDBACK OPERATIONS
    // ==========================================
    async getFeedbacks(filter = {}) {
        if (isMongoActive()) {
            const query = {};
            if (filter.topic && filter.topic !== 'All Topics') query.topic = filter.topic;
            if (filter.rating) query.rating = Number(filter.rating);
            return await Feedback.find(query).sort({ createdAt: -1 }).lean();
        }
        let list = readJson('feedback');
        if (filter.topic && filter.topic !== 'All Topics') {
            list = list.filter(item => item.topic === filter.topic);
        }
        if (filter.rating) {
            list = list.filter(item => Number(item.rating) === Number(filter.rating));
        }
        return list;
    },

    async createFeedback(data) {
        const payload = {
            id: data.id || 'FB-' + Date.now(),
            name: data.name,
            email: data.email,
            topic: data.topic,
            rating: Number(data.rating),
            feedback: data.feedback,
            approved: true,
            createdAt: new Date().toISOString()
        };

        if (isMongoActive()) {
            return await Feedback.create(payload);
        }
        const list = readJson('feedback');
        list.unshift(payload);
        writeJson('feedback', list);
        return payload;
    },

    async deleteFeedback(id) {
        if (isMongoActive()) {
            return await Feedback.findOneAndDelete({ $or: [{ _id: id }, { id: id }] });
        }
        let list = readJson('feedback');
        const idx = list.findIndex(f => f.id === id || String(f._id) === String(id));
        if (idx !== -1) {
            const removed = list.splice(idx, 1)[0];
            writeJson('feedback', list);
            return removed;
        }
        return null;
    },

    // ==========================================
    // 2. MERCHANDISE OPERATIONS
    // ==========================================
    async getMerchandise(filter = {}) {
        if (isMongoActive()) {
            return await Merchandise.find(filter).sort({ registeredAt: -1 }).lean();
        }
        let list = readJson('merchandise');
        if (filter.status) list = list.filter(m => m.status === filter.status);
        return list;
    },

    async getMerchandiseById(id) {
        if (isMongoActive()) {
            return await Merchandise.findOne({
                $or: [{ id: id }, { vipPassId: id }, { _id: id }]
            }).lean();
        }
        const list = readJson('merchandise');
        return list.find(m => m.id === id || m.vipPassId === id || String(m._id) === String(id)) || null;
    },

    async createMerchandise(data) {
        const payload = {
            id: data.id || 'MERCH-' + Date.now(),
            vipPassId: data.vipPassId || 'VIP-ORBIT-' + Math.floor(1000 + Math.random() * 9000),
            name: data.name,
            email: data.email,
            product: data.product,
            size: data.size || 'Medium',
            quantity: Number(data.quantity || 1),
            suggestions: data.suggestions || data.wishlist || 'None provided',
            discount: data.discount || '20% VIP DISCOUNT',
            status: data.status || 'confirmed',
            registeredAt: new Date().toISOString()
        };

        if (isMongoActive()) {
            return await Merchandise.create(payload);
        }
        const list = readJson('merchandise');
        list.unshift(payload);
        writeJson('merchandise', list);
        return payload;
    },

    async updateMerchandiseStatus(id, status) {
        if (isMongoActive()) {
            return await Merchandise.findOneAndUpdate(
                { $or: [{ _id: id }, { id: id }, { vipPassId: id }] },
                { status },
                { new: true }
            );
        }
        const list = readJson('merchandise');
        const item = list.find(m => m.id === id || m._id === id || m.vipPassId === id);
        if (item) {
            item.status = status;
            writeJson('merchandise', list);
            return item;
        }
        return null;
    },

    async deleteMerchandise(id) {
        if (isMongoActive()) {
            return await Merchandise.findOneAndDelete({
                $or: [{ _id: id }, { id: id }, { vipPassId: id }]
            });
        }
        let list = readJson('merchandise');
        const idx = list.findIndex(m => m.id === id || m.vipPassId === id || String(m._id) === String(id));
        if (idx !== -1) {
            const removed = list.splice(idx, 1)[0];
            writeJson('merchandise', list);
            return removed;
        }
        return null;
    },

    // ==========================================
    // 3. SATELLITE WATCHLIST OPERATIONS
    // ==========================================
    async getSatelliteTracks() {
        if (isMongoActive()) {
            return await SatelliteTrack.find().sort({ spottedAt: -1 }).lean();
        }
        return readJson('satellites');
    },

    async createSatelliteTrack(data) {
        const payload = {
            id: 'SAT-' + Date.now(),
            noradId: Number(data.noradId),
            name: data.name,
            category: data.category || 'Scientific',
            orbitType: data.orbitType || 'LEO',
            notes: data.notes || 'Tracked via Solar Explorer Ground Station',
            observerLocation: data.observerLocation || 'Earth Ground Station',
            spottedAt: new Date().toISOString()
        };

        if (isMongoActive()) {
            return await SatelliteTrack.create(payload);
        }
        const list = readJson('satellites');
        // Prevent duplicate NORAD IDs in watchlist
        if (!list.some(s => s.noradId === payload.noradId)) {
            list.unshift(payload);
            writeJson('satellites', list);
        }
        return payload;
    },

    async deleteSatelliteTrack(noradId) {
        const idNum = Number(noradId);
        if (isMongoActive()) {
            return await SatelliteTrack.findOneAndDelete({
                $or: [{ noradId: idNum }, { id: String(noradId) }]
            });
        }
        let list = readJson('satellites');
        const initialLen = list.length;
        list = list.filter(s => s.noradId !== idNum && s.id !== String(noradId));
        if (list.length !== initialLen) {
            writeJson('satellites', list);
            return { success: true, removedId: noradId };
        }
        return null;
    },

    // ==========================================
    // 4. QUIZ SCORE OPERATIONS
    // ==========================================
    async getQuizScores(limit = 10) {
        if (isMongoActive()) {
            return await QuizScore.find().sort({ score: -1, completedAt: -1 }).limit(limit).lean();
        }
        const list = readJson('quizscores');
        return list.sort((a, b) => b.score - a.score).slice(0, limit);
    },

    async createQuizScore(data) {
        const payload = {
            id: 'QS-' + Date.now(),
            playerName: data.playerName || 'Anonymous Explorer',
            score: Number(data.score || 0),
            totalQuestions: Number(data.totalQuestions || 5),
            rankTitle: data.rankTitle || 'Orbital Explorer',
            category: data.category || 'Cosmic Astrophysics',
            completedAt: new Date().toISOString()
        };

        if (isMongoActive()) {
            return await QuizScore.create(payload);
        }
        const list = readJson('quizscores');
        list.push(payload);
        writeJson('quizscores', list);
        return payload;
    },

    // ==========================================
    // 5. AGGREGATE SYSTEM STATS
    // ==========================================
    async getSystemStats() {
        const feedbacks = await this.getFeedbacks();
        const merch = await this.getMerchandise();
        const satellites = await this.getSatelliteTracks();
        const quizScores = await this.getQuizScores(100);

        const avgRating = feedbacks.length
            ? (feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / feedbacks.length).toFixed(1)
            : '5.0';

        const remainingCapacity = Math.max(0, 500 - merch.length);

        return {
            totalFeedbacks: feedbacks.length,
            averageRating: avgRating,
            totalMerchOrders: merch.length,
            remainingMerchAllocations: remainingCapacity,
            totalSatellitesTracked: satellites.length,
            totalQuizzesTaken: quizScores.length,
            storageMode: isMongoActive() ? 'mongodb' : 'json_fallback'
        };
    }
};

module.exports = StorageService;
