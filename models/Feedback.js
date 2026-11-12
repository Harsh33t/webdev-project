const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => 'FB-' + Date.now()
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    topic: {
        type: String,
        required: [true, 'Topic selection is required'],
        enum: ['Planets', 'The Sun', 'Extreme Space', 'Missions', 'Fun Space', 'Satellites', 'Merchandise', 'General Feedback']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: [true, 'Feedback message is required'],
        minlength: [3, 'Feedback must be at least 3 characters long'],
        maxlength: 2000
    },
    approved: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
