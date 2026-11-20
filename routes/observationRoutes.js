/**
 * routes/observationRoutes.js
 * Express Router mapping the 5 Core CRUD Endpoints to Observation Controller
 * 
 * Routes:
 * - POST   /                 -> Create Observation (HTTP 201)
 * - GET    /                 -> Read All Observations (HTTP 200, supports ?category= & ?status= & ?search=)
 * - GET    /:id              -> Read Single Observation by ID (HTTP 200 / 404)
 * - PATCH  /:id              -> Update / Partial Modify Observation (HTTP 200 / 404)
 * - DELETE /:id              -> Remove Observation (HTTP 200 / 404)
 */

const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationController');

// 1. CREATE - Storing new data records in MongoDB
router.post('/', observationController.createObservation);

// 2. READ ALL - Fetching all data entries with find()
router.get('/', observationController.getAllObservations);

// 3. READ ONE - Fetching a single data entry by ID with findById()
router.get('/:id', observationController.getObservationById);

// 4. UPDATE - Modifying existing records using PATCH (findByIdAndUpdate)
router.patch('/:id', observationController.updateObservation);

// 5. DELETE - Removing data using findByIdAndDelete
router.delete('/:id', observationController.deleteObservation);

module.exports = router;
