const mongoose = require('mongoose');

const satelliteTrackSchema = new mongoose.Schema({
    noradId: {
        type: Number,
        required: [true, 'NORAD Catalog ID is required']
    },
    name: {
        type: String,
        required: [true, 'Satellite name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Space Station', 'Space Telescope', 'Earth Observation', 'Weather', 'Communications', 'Mega-Constellation', 'Scientific', 'Other'],
        default: 'Scientific'
    },
    orbitType: {
        type: String,
        enum: ['LEO', 'MEO', 'GEO', 'L2 Halo', 'Other'],
        default: 'LEO'
    },
    notes: {
        type: String,
        default: 'Tracked via Solar Explorer Ground Station'
    },
    spottedAt: {
        type: Date,
        default: Date.now
    },
    observerLocation: {
        type: String,
        default: 'Global Ground Station'
    }
}, { timestamps: true });

module.exports = mongoose.model('SatelliteTrack', satelliteTrackSchema);

