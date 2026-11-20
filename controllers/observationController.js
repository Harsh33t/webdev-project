/**
 * controllers/observationController.js
 * Controller implementing complete CRUD Operations for Celestial Observations
 * Supports both Mongoose ODM (MongoDB local / Atlas) and Resilient Dual-Storage JSON fallback
 * 
 * Endpoints:
 * - Create:     POST   /api/observations     -> HTTP 201 Created (stores new record in MongoDB)
 * - Read All:   GET    /api/observations     -> HTTP 200 OK (find() with optional filtering)
 * - Read One:   GET    /api/observations/:id -> HTTP 200 OK (findById())
 * - Update:     PATCH  /api/observations/:id -> HTTP 200 OK (findByIdAndUpdate with new: true)
 * - Delete:     DELETE /api/observations/:id -> HTTP 200 OK (findByIdAndDelete())
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Observation = require('../models/Observation');
const { isMongoActive } = require('../config/db');

// Path to fallback observations file
const JSON_FILE = path.join(__dirname, '..', 'data', 'observations.json');

// Helper: Read JSON observations safely
function readLocalObservations() {
    try {
        if (!fs.existsSync(JSON_FILE)) {
            fs.writeFileSync(JSON_FILE, '[]', 'utf8');
            return [];
        }
        const content = fs.readFileSync(JSON_FILE, 'utf8');
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('[ObservationController] Error reading observations.json:', err.message);
        return [];
    }
}

// Helper: Write JSON observations safely
function writeLocalObservations(data) {
    try {
        fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('[ObservationController] Error writing observations.json:', err.message);
    }
}

// Helper: Generate a MongoDB-compatible 24-character hexadecimal ObjectId string
function generateId() {
    return crypto.randomBytes(12).toString('hex');
}

/**
 * 1. CREATE OBSERVATION
 * POST /api/observations
 * HTTP 201 Created
 */
exports.createObservation = async (req, res) => {
    try {
        const { title, category, celestialObject, coordinates, observerName, userId, notes, status, rating } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, error: 'Observation title is required.' });
        }
        if (!celestialObject || !celestialObject.trim()) {
            return res.status(400).json({ success: false, error: 'Celestial object is required.' });
        }
        if (!observerName || !observerName.trim()) {
            return res.status(400).json({ success: false, error: 'Observer name is required.' });
        }
        if (!notes || !notes.trim()) {
            return res.status(400).json({ success: false, error: 'Observation notes are required.' });
        }

        const validCategories = ['Planet', 'Deep Space', 'Satellite', 'Solar Event', 'Meteor', 'Exoplanet'];
        const chosenCategory = validCategories.includes(category) ? category : 'Deep Space';

        const validStatuses = ['Draft', 'Verified', 'Flagship Observation'];
        const chosenStatus = validStatuses.includes(status) ? status : 'Verified';

        const numRating = Number(rating) >= 1 && Number(rating) <= 5 ? Number(rating) : 5;

        // Clean coordinates format
        let parsedCoords = { ra: 'N/A', dec: 'N/A' };
        if (typeof coordinates === 'string') {
            parsedCoords = { ra: coordinates, dec: '' };
        } else if (coordinates && typeof coordinates === 'object') {
            parsedCoords = {
                ra: coordinates.ra || 'N/A',
                dec: coordinates.dec || 'N/A'
            };
        }

        const payload = {
            title: title.trim(),
            category: chosenCategory,
            celestialObject: celestialObject.trim(),
            coordinates: parsedCoords,
            observerName: observerName.trim(),
            userId: userId || null,
            notes: notes.trim(),
            status: chosenStatus,
            rating: numRating
        };

        let resultDoc;

        // Primary: MongoDB via Mongoose ODM
        if (isMongoActive()) {
            try {
                resultDoc = await Observation.create(payload);
                console.log(`[CRUD / Create] Stored new observation in MongoDB with ID: ${resultDoc._id}`);

                // Background sync to JSON fallback
                const localList = readLocalObservations();
                const docObj = resultDoc.toObject();
                localList.unshift(docObj);
                writeLocalObservations(localList);

                return res.status(201).json({
                    success: true,
                    message: 'Celestial observation created successfully in MongoDB',
                    storageMode: 'mongodb',
                    data: resultDoc
                });
            } catch (mongoErr) {
                console.warn(`[CRUD / Create] Mongoose save error, falling back to JSON: ${mongoErr.message}`);
            }
        }

        // Secondary: Resilient Dual-Storage JSON fallback
        const localList = readLocalObservations();
        const nowIso = new Date().toISOString();
        const newRecord = {
            _id: generateId(),
            ...payload,
            createdAt: nowIso,
            updatedAt: nowIso
        };
        newRecord.id = newRecord._id;

        localList.unshift(newRecord);
        writeLocalObservations(localList);

        console.log(`[CRUD / Create] Stored observation in observations.json fallback with ID: ${newRecord._id}`);
        return res.status(201).json({
            success: true,
            message: 'Celestial observation created successfully (Dual-Storage Fallback)',
            storageMode: 'json_fallback',
            data: newRecord
        });

    } catch (err) {
        console.error('[CRUD / Create] Error creating observation:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to create observation',
            details: err.message
        });
    }
};

/**
 * 2. READ ALL OBSERVATIONS
 * GET /api/observations
 * HTTP 200 OK (with optional query filter by category or status or search)
 */
exports.getAllObservations = async (req, res) => {
    try {
        const { category, status, search } = req.query;

        // Primary: MongoDB find()
        if (isMongoActive()) {
            try {
                const query = {};
                if (category && category !== 'All' && category !== 'All Categories') {
                    query.category = category;
                }
                if (status && status !== 'All' && status !== 'All Statuses') {
                    query.status = status;
                }
                if (search && search.trim()) {
                    query.$or = [
                        { title: { $regex: search.trim(), $options: 'i' } },
                        { celestialObject: { $regex: search.trim(), $options: 'i' } },
                        { observerName: { $regex: search.trim(), $options: 'i' } },
                        { notes: { $regex: search.trim(), $options: 'i' } }
                    ];
                }

                const observations = await Observation.find(query).sort({ createdAt: -1 });

                return res.status(200).json({
                    success: true,
                    count: observations.length,
                    storageMode: 'mongodb',
                    data: observations
                });
            } catch (mongoErr) {
                console.warn(`[CRUD / Read All] MongoDB find error, falling back to JSON: ${mongoErr.message}`);
            }
        }

        // Secondary: Resilient JSON Fallback
        let list = readLocalObservations();

        if (category && category !== 'All' && category !== 'All Categories') {
            list = list.filter(item => item.category === category);
        }
        if (status && status !== 'All' && status !== 'All Statuses') {
            list = list.filter(item => item.status === status);
        }
        if (search && search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(item =>
                (item.title && item.title.toLowerCase().includes(q)) ||
                (item.celestialObject && item.celestialObject.toLowerCase().includes(q)) ||
                (item.observerName && item.observerName.toLowerCase().includes(q)) ||
                (item.notes && item.notes.toLowerCase().includes(q))
            );
        }

        // Sort descending by date
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        return res.status(200).json({
            success: true,
            count: list.length,
            storageMode: 'json_fallback',
            data: list
        });

    } catch (err) {
        console.error('[CRUD / Read All] Error fetching observations:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve observations',
            details: err.message
        });
    }
};

/**
 * 3. READ ONE OBSERVATION BY ID
 * GET /api/observations/:id
 * HTTP 200 OK (HTTP 404 if not found)
 */
exports.getObservationById = async (req, res) => {
    try {
        const { id } = req.params;

        // Primary: MongoDB findById()
        if (isMongoActive()) {
            try {
                let observation = null;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    observation = await Observation.findById(id);
                }
                if (!observation) {
                    observation = await Observation.findOne({
                        $or: [{ _id: id }, { id: id }]
                    });
                }

                if (observation) {
                    return res.status(200).json({
                        success: true,
                        storageMode: 'mongodb',
                        data: observation
                    });
                }
            } catch (mongoErr) {
                console.warn(`[CRUD / Read One] MongoDB findById error, falling back to JSON: ${mongoErr.message}`);
            }
        }

        // Secondary: Resilient JSON Fallback
        const list = readLocalObservations();
        const found = list.find(item => item._id === id || item.id === id || String(item._id) === String(id));

        if (!found) {
            return res.status(404).json({
                success: false,
                error: `Observation with ID '${id}' was not found.`
            });
        }

        return res.status(200).json({
            success: true,
            storageMode: 'json_fallback',
            data: found
        });

    } catch (err) {
        console.error('[CRUD / Read One] Error fetching observation by ID:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve observation',
            details: err.message
        });
    }
};

/**
 * 4. UPDATE OBSERVATION (PATCH)
 * PATCH /api/observations/:id
 * HTTP 200 OK using findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
 */
exports.updateObservation = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // Prevent modification of protected system fields
        delete updates._id;
        delete updates.id;
        delete updates.createdAt;
        updates.updatedAt = new Date().toISOString();

        // Primary: MongoDB findByIdAndUpdate()
        if (isMongoActive()) {
            try {
                let updatedDoc = null;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    updatedDoc = await Observation.findByIdAndUpdate(
                        id,
                        { $set: updates },
                        { new: true, runValidators: true }
                    );
                }

                if (!updatedDoc) {
                    updatedDoc = await Observation.findOneAndUpdate(
                        { $or: [{ _id: id }, { id: id }] },
                        { $set: updates },
                        { new: true, runValidators: true }
                    );
                }

                if (updatedDoc) {
                    console.log(`[CRUD / Patch] Updated observation ${id} via Mongoose findByIdAndUpdate`);

                    // Sync to local JSON fallback
                    const localList = readLocalObservations();
                    const idx = localList.findIndex(item => item._id === id || item.id === id || String(item._id) === String(id));
                    if (idx !== -1) {
                        localList[idx] = updatedDoc.toObject();
                        writeLocalObservations(localList);
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Observation updated successfully via Mongoose findByIdAndUpdate',
                        storageMode: 'mongodb',
                        data: updatedDoc
                    });
                }
            } catch (mongoErr) {
                console.warn(`[CRUD / Patch] MongoDB findByIdAndUpdate error: ${mongoErr.message}`);
                // If it's a validation error, return 400
                if (mongoErr.name === 'ValidationError') {
                    return res.status(400).json({
                        success: false,
                        error: mongoErr.message
                    });
                }
            }
        }

        // Secondary: Resilient JSON Fallback
        const list = readLocalObservations();
        const idx = list.findIndex(item => item._id === id || item.id === id || String(item._id) === String(id));

        if (idx === -1) {
            return res.status(404).json({
                success: false,
                error: `Observation with ID '${id}' was not found for update.`
            });
        }

        // Merge updates
        list[idx] = {
            ...list[idx],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        writeLocalObservations(list);
        console.log(`[CRUD / Patch] Updated observation ${id} in JSON fallback`);

        return res.status(200).json({
            success: true,
            message: 'Observation updated successfully (JSON Fallback)',
            storageMode: 'json_fallback',
            data: list[idx]
        });

    } catch (err) {
        console.error('[CRUD / Patch] Error updating observation:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to update observation',
            details: err.message
        });
    }
};

/**
 * 5. DELETE OBSERVATION
 * DELETE /api/observations/:id
 * HTTP 200 OK using findByIdAndDelete(id)
 */
exports.deleteObservation = async (req, res) => {
    try {
        const { id } = req.params;

        // Primary: MongoDB findByIdAndDelete()
        if (isMongoActive()) {
            try {
                let deletedDoc = null;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    deletedDoc = await Observation.findByIdAndDelete(id);
                }

                if (!deletedDoc) {
                    deletedDoc = await Observation.findOneAndDelete({
                        $or: [{ _id: id }, { id: id }]
                    });
                }

                if (deletedDoc) {
                    console.log(`[CRUD / Delete] Deleted observation ${id} via Mongoose findByIdAndDelete`);

                    // Sync removal with local JSON fallback
                    const localList = readLocalObservations();
                    const filtered = localList.filter(item => item._id !== id && item.id !== id && String(item._id) !== String(id));
                    writeLocalObservations(filtered);

                    return res.status(200).json({
                        success: true,
                        message: 'Observation deleted successfully via Mongoose findByIdAndDelete',
                        storageMode: 'mongodb',
                        data: deletedDoc
                    });
                }
            } catch (mongoErr) {
                console.warn(`[CRUD / Delete] MongoDB findByIdAndDelete error: ${mongoErr.message}`);
            }
        }

        // Secondary: Resilient JSON Fallback
        const list = readLocalObservations();
        const idx = list.findIndex(item => item._id === id || item.id === id || String(item._id) === String(id));

        if (idx === -1) {
            return res.status(404).json({
                success: false,
                error: `Observation with ID '${id}' was not found for deletion.`
            });
        }

        const removed = list.splice(idx, 1)[0];
        writeLocalObservations(list);
        console.log(`[CRUD / Delete] Removed observation ${id} from JSON fallback`);

        return res.status(200).json({
            success: true,
            message: 'Observation deleted successfully (JSON Fallback)',
            storageMode: 'json_fallback',
            data: removed
        });

    } catch (err) {
        console.error('[CRUD / Delete] Error deleting observation:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete observation',
            details: err.message
        });
    }
};
