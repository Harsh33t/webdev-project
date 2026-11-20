/**
 * models/Observation.js
 * Mongoose Schema & Model for Celestial Observation Logs / Explorer Mission Posts
 * Full-Stack CRUD Demonstration (Create, Read, Update, Delete)
 * Solar Explorer A3 Architecture
 */

const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Observation title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Planet', 'Deep Space', 'Satellite', 'Solar Event', 'Meteor', 'Exoplanet'],
            message: '{VALUE} is not a valid observation category'
        }
    },
    celestialObject: {
        type: String,
        required: [true, 'Celestial object name is required (e.g., Jupiter, ISS, M31)'],
        trim: true,
        maxlength: [100, 'Celestial object cannot exceed 100 characters']
    },
    coordinates: {
        type: mongoose.Schema.Types.Mixed,
        default: () => ({ ra: 'N/A', dec: 'N/A' })
    },
    observerName: {
        type: String,
        required: [true, 'Observer name is required'],
        trim: true,
        maxlength: [100, 'Observer name cannot exceed 100 characters']
    },
    userId: {
        type: String,
        default: null,
        trim: true
    },
    notes: {
        type: String,
        required: [true, 'Observation notes are required'],
        trim: true,
        maxlength: [4000, 'Notes cannot exceed 4000 characters']
    },
    status: {
        type: String,
        enum: {
            values: ['Draft', 'Verified', 'Flagship Observation'],
            message: '{VALUE} is not a valid observation status'
        },
        default: 'Verified'
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1 star'],
        max: [5, 'Rating cannot exceed 5 stars'],
        default: 5
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            return ret;
        }
    }
});

// Text indexing for fast search across title, object, and notes
observationSchema.index({ title: 'text', celestialObject: 'text', notes: 'text' });
observationSchema.index({ category: 1, status: 1 });
observationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Observation', observationSchema);
