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
const Order = require('../models/Order');
const User = require('../models/User');
const Observation = require('../models/Observation');

const DATA_DIR = process.env.STORAGE_FILE_DIR
    ? path.resolve(__dirname, '..', process.env.STORAGE_FILE_DIR)
    : path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const FILE_PATHS = {
    feedback: path.join(DATA_DIR, 'feedback.json'),
    merchandise: path.join(DATA_DIR, 'merchandise.json'),
    satellites: path.join(DATA_DIR, 'satellites.json'),
    quizscores: path.join(DATA_DIR, 'quizscores.json'),
    orders: path.join(DATA_DIR, 'orders.json'),
    users: path.join(DATA_DIR, 'users.json'),
    products: path.join(DATA_DIR, 'products.json'),
    observations: path.join(DATA_DIR, 'observations.json')
};

// Initialize JSON files with defaults if not present
if (!fs.existsSync(FILE_PATHS.feedback)) fs.writeFileSync(FILE_PATHS.feedback, '[]', 'utf8');
if (!fs.existsSync(FILE_PATHS.merchandise)) fs.writeFileSync(FILE_PATHS.merchandise, '[]', 'utf8');
if (!fs.existsSync(FILE_PATHS.orders)) fs.writeFileSync(FILE_PATHS.orders, '[]', 'utf8');
if (!fs.existsSync(FILE_PATHS.users)) fs.writeFileSync(FILE_PATHS.users, '[]', 'utf8');
if (!fs.existsSync(FILE_PATHS.observations)) fs.writeFileSync(FILE_PATHS.observations, '[]', 'utf8');
if (!fs.existsSync(FILE_PATHS.products)) fs.writeFileSync(FILE_PATHS.products, '[]', 'utf8');
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
    console.log(`[Storage] ✅ Wrote ${data.length} record(s) to ${FILE_PATHS[key]}`);
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
        // The storefront and API clients use short apparel sizes (S/M/L), while
        // the database keeps the descriptive values required by its schema.
        const sizeAliases = {
            S: 'Small',
            M: 'Medium',
            L: 'Large',
            XL: 'XL',
            XXL: '2XL',
            '2XL': '2XL'
        };
        const requestedSize = String(data.size || 'Medium').trim();
        const payload = {
            id: data.id || 'MERCH-' + Date.now(),
            vipPassId: data.vipPassId || 'VIP-ORBIT-' + Math.floor(1000 + Math.random() * 9000),
            name: data.name,
            email: data.email,
            product: data.product,
            size: sizeAliases[requestedSize.toUpperCase()] || requestedSize,
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
    // 5. E-COMMERCE ORDERS OPERATIONS (BUY FLOW)
    // ==========================================
    async createOrder(data) {
        const orderId = data.orderId || ('ORD-2026-' + Math.floor(1000 + Math.random() * 9000));
        const trackingNum = data.trackingNumber || ('TRK-SOLAR-' + Math.random().toString(36).substring(2, 8).toUpperCase());
        const nowIso = new Date().toISOString();

        const payload = {
            id: orderId,
            orderId: orderId,
            customer: {
                name: (data.customer && data.customer.name) ? data.customer.name.trim() : 'Explorer',
                email: (data.customer && data.customer.email) ? data.customer.email.trim().toLowerCase() : '',
                address: (data.customer && data.customer.address) ? data.customer.address.trim() : '',
                city: (data.customer && data.customer.city) ? data.customer.city.trim() : '',
                state: (data.customer && data.customer.state) ? data.customer.state.trim() : 'CA',
                zip: (data.customer && data.customer.zip) ? data.customer.zip.trim() : ''
            },
            items: (data.items || []).map(i => ({
                productId: String(i.productId || 'space-merch'),
                title: String(i.title || 'Space Merchandise Item'),
                price: Number(i.price || 0),
                size: i.size || 'M',
                quantity: Number(i.quantity || 1),
                image: i.image || 'images/merch/lunar-bomber.png'
            })),
            totalAmount: Number(data.totalAmount || 0),
            shippingFee: 0.00,
            currency: 'USD',
            paymentMethod: data.paymentMethod || 'demo_card',
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            trackingNumber: trackingNum,
            estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            emailNotification: data.emailNotification || {
                dispatched: false,
                messageId: null,
                previewUrl: null,
                receiptFile: null,
                dispatchedAt: null,
                dispatchMode: 'pending'
            },
            createdAt: nowIso,
            updatedAt: nowIso,
            username: data.username || (data.customer && data.customer.username) || null
        };

        if (isMongoActive()) {
            try {
                const doc = await Order.create(payload);
                payload._id = doc._id;
            } catch (err) {
                console.warn('[StorageService] Mongo Order error:', err.message);
            }
        }

        const list = readJson('orders');
        list.unshift(payload);
        writeJson('orders', list);

        // Auto-link to user if username provided
        if (payload.username) {
            try {
                await this.linkUserOrder(payload.username, orderId, payload.totalAmount);
            } catch (linkErr) {}
        }

        return payload;
    },

    async getOrderById(id) {
        if (!id) return null;
        const q = String(id).trim();

        if (isMongoActive()) {
            try {
                const found = await Order.findOne({
                    $or: [
                        { orderId: q },
                        { trackingNumber: q },
                        ...(q.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: q }] : [])
                    ]
                }).lean();
                if (found) return found;
            } catch (err) { }
        }

        const list = readJson('orders');
        return list.find(o => o.orderId === q || o.id === q || o.trackingNumber === q || String(o._id) === q) || null;
    },

    async getOrders(filter = {}, limit = 50) {
        if (isMongoActive()) {
            try {
                return await Order.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
            } catch (err) { }
        }
        let list = readJson('orders');
        if (filter.email) list = list.filter(o => o.customer && o.customer.email.toLowerCase() === filter.email.toLowerCase());
        return list.slice(0, limit);
    },

    async updateOrderEmailStatus(orderId, emailMeta) {
        const q = String(orderId).trim();
        if (isMongoActive()) {
            try {
                await Order.findOneAndUpdate(
                    { $or: [{ orderId: q }, { id: q }] },
                    { $set: { emailNotification: emailMeta, updatedAt: new Date().toISOString() } }
                );
            } catch (err) { }
        }
        const list = readJson('orders');
        const o = list.find(item => item.orderId === q || item.id === q);
        if (o) {
            o.emailNotification = { ...o.emailNotification, ...emailMeta };
            o.updatedAt = new Date().toISOString();
            writeJson('orders', list);
        }
    },

    async updateOrderStatus(orderId, status) {
        const q = String(orderId).trim();
        if (isMongoActive()) {
            try {
                const updatedDoc = await Order.findOneAndUpdate(
                    {
                        $or: [
                            { orderId: q },
                            { id: q },
                            { trackingNumber: q },
                            ...(q.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: q }] : [])
                        ]
                    },
                    { $set: { orderStatus: status, updatedAt: new Date().toISOString() } },
                    { new: true }
                ).lean();
                if (updatedDoc) return updatedDoc;
            } catch (err) { }
        }
        const list = readJson('orders');
        const o = list.find(item => item.orderId === q || item.id === q || item.trackingNumber === q);
        if (o) {
            o.orderStatus = status;
            o.updatedAt = new Date().toISOString();
            writeJson('orders', list);
            return o;
        }
        return null;
    },

    // ==========================================
    // 5.5 USER OPERATIONS (Dual Storage: MongoDB + JSON)
    // ==========================================
    async createUser(userData) {
        if (isMongoActive()) {
            try {
                const doc = await User.create(userData);
                const list = readJson('users');
                list.push(doc.toObject ? doc.toObject() : userData);
                writeJson('users', list);
                return doc.toObject ? doc.toObject() : userData;
            } catch (err) {
                console.warn('[StorageService] Mongo User create:', err.message);
            }
        }
        const list = readJson('users');
        list.push(userData);
        writeJson('users', list);
        return userData;
    },

    async getUserByUsername(username) {
        if (!username) return null;
        const q = String(username).trim().toLowerCase();
        if (isMongoActive()) {
            try {
                const found = await User.findOne({ username: new RegExp('^' + q + '$', 'i') }).lean();
                if (found) return found;
            } catch (err) {}
        }
        const list = readJson('users');
        return list.find(u => u.username && u.username.toLowerCase() === q) || null;
    },

    async updateUser(username, updateFields) {
        if (!username) return null;
        const q = String(username).trim().toLowerCase();
        if (isMongoActive()) {
            try {
                await User.findOneAndUpdate(
                    { username: new RegExp('^' + q + '$', 'i') },
                    { $set: updateFields }
                );
            } catch (err) {}
        }
        const list = readJson('users');
        const user = list.find(u => u.username && u.username.toLowerCase() === q);
        if (user) {
            Object.assign(user, updateFields);
            writeJson('users', list);
            return user;
        }
        return null;
    },

    async linkUserOrder(username, orderId, amount = 0) {
        if (!username || !orderId) return;
        const user = await this.getUserByUsername(username);
        if (!user) return;

        const orderIds = Array.isArray(user.orderIds) ? user.orderIds : [];
        if (!orderIds.includes(orderId)) {
            orderIds.push(orderId);
            const stats = user.stats || { quizzesTaken: 0, totalSpent: 0, pagesVisited: [], feedbackSubmitted: 0 };
            stats.totalSpent = (stats.totalSpent || 0) + Number(amount || 0);

            const achievements = Array.isArray(user.achievements) ? user.achievements : [];
            if (orderIds.length >= 1 && !achievements.includes('First Purchase 🛍️')) {
                achievements.push('First Purchase 🛍️');
            }
            if (orderIds.length >= 3 && !achievements.includes('Space Shopper 🌌')) {
                achievements.push('Space Shopper 🌌');
            }
            if (stats.totalSpent >= 200 && !achievements.includes('Galaxy Collector 🌠')) {
                achievements.push('Galaxy Collector 🌠');
            }

            await this.updateUser(username, { orderIds, stats, achievements });
        }
    },

    // ==========================================
    // 5.8 CELESTIAL OBSERVATIONS (CRUD Operations)
    // ==========================================
    async getObservations(filter = {}) {
        if (isMongoActive()) {
            try {
                const query = {};
                if (filter.category) query.category = filter.category;
                if (filter.celestialBody) query.celestialBody = new RegExp(filter.celestialBody, 'i');
                return await Observation.find(query).sort({ observationDate: -1 }).lean();
            } catch (err) {
                console.warn('[StorageService] Mongo Observation find:', err.message);
            }
        }
        let list = readJson('observations');
        if (filter.category) list = list.filter(o => o.category === filter.category);
        if (filter.celestialBody) {
            const term = filter.celestialBody.toLowerCase();
            list = list.filter(o => o.celestialBody && o.celestialBody.toLowerCase().includes(term));
        }
        return list;
    },

    async getObservationById(id) {
        if (!id) return null;
        const q = String(id).trim();
        if (isMongoActive()) {
            try {
                const found = await Observation.findOne({
                    $or: [
                        { id: q },
                        ...(q.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: q }] : [])
                    ]
                }).lean();
                if (found) return found;
            } catch (err) { }
        }
        const list = readJson('observations');
        return list.find(o => o.id === q || String(o._id) === q) || null;
    },

    async createObservation(data) {
        const obsId = data.id || ('OBS-2026-' + Math.floor(100 + Math.random() * 900));
        const nowIso = new Date().toISOString();
        const payload = {
            id: obsId,
            observerName: data.observerName || 'Cosmic Observer',
            celestialBody: data.celestialBody || 'Unidentified Celestial Target',
            category: data.category || 'Planet',
            observationDate: data.observationDate || nowIso,
            location: data.location || 'Standard Ground Station',
            coordinates: data.coordinates || { rightAscension: '00h 00m 00s', declination: '+00° 00\' 00"' },
            equipment: data.equipment || { telescope: '8-inch Dobsonian', eyepieceOrSensor: '25mm Eyepiece', filter: 'None' },
            seeingConditions: data.seeingConditions || { bortleScale: 4, transparency: 'Good', temperatureCelsius: 18 },
            notes: data.notes || 'Routine celestial survey and optical verification.',
            verified: data.verified !== undefined ? Boolean(data.verified) : false,
            tags: Array.isArray(data.tags) ? data.tags : ['amateur-astronomy'],
            createdAt: nowIso,
            updatedAt: nowIso
        };

        if (isMongoActive()) {
            try {
                const doc = await Observation.create(payload);
                payload._id = doc._id;
            } catch (err) {
                console.warn('[StorageService] Mongo Observation create:', err.message);
            }
        }
        const list = readJson('observations');
        list.unshift(payload);
        writeJson('observations', list);
        return payload;
    },

    async updateObservation(id, updateFields) {
        if (!id) return null;
        const q = String(id).trim();
        const nowIso = new Date().toISOString();
        const cleanUpdate = { ...updateFields, updatedAt: nowIso };
        delete cleanUpdate._id;
        delete cleanUpdate.id;

        if (isMongoActive()) {
            try {
                const updatedDoc = await Observation.findOneAndUpdate(
                    {
                        $or: [
                            { id: q },
                            ...(q.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: q }] : [])
                        ]
                    },
                    { $set: cleanUpdate },
                    { new: true }
                ).lean();
                if (updatedDoc) return updatedDoc;
            } catch (err) { }
        }

        const list = readJson('observations');
        const idx = list.findIndex(o => o.id === q || String(o._id) === q);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...cleanUpdate };
            writeJson('observations', list);
            return list[idx];
        }
        return null;
    },

    async deleteObservation(id) {
        if (!id) return null;
        const q = String(id).trim();
        if (isMongoActive()) {
            try {
                const deleted = await Observation.findOneAndDelete({
                    $or: [
                        { id: q },
                        ...(q.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: q }] : [])
                    ]
                }).lean();
                if (deleted) return deleted;
            } catch (err) { }
        }
        let list = readJson('observations');
        const idx = list.findIndex(o => o.id === q || String(o._id) === q);
        if (idx !== -1) {
            const removed = list.splice(idx, 1)[0];
            writeJson('observations', list);
            return removed;
        }
        return null;
    },

    // ==========================================
    // 6. PUBLIC JSON READ HELPER (for cross-module use)
    // ==========================================
    readJsonPublic(key) {
        return readJson(key);
    },

    // ==========================================
    // 7. AGGREGATE SYSTEM STATS
    // ==========================================
    async getSystemStats() {
        const feedbacks = await this.getFeedbacks();
        const merch = await this.getMerchandise();
        const satellites = await this.getSatelliteTracks();
        const quizScores = await this.getQuizScores(100);
        const orders = await this.getOrders({}, 200);

        const avgRating = feedbacks.length
            ? (feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / feedbacks.length).toFixed(1)
            : '5.0';

        const remainingCapacity = Math.max(0, 500 - merch.length - orders.length);

        return {
            totalFeedbacks: feedbacks.length,
            averageRating: avgRating,
            totalMerchOrders: merch.length + orders.length,
            totalOrdersProcessed: orders.length,
            remainingMerchAllocations: remainingCapacity,
            totalSatellitesTracked: satellites.length,
            totalQuizzesTaken: quizScores.length,
            storageMode: isMongoActive() ? 'mongodb' : 'json_fallback'
        };
    }
};

module.exports = StorageService;

