const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => 'QS-' + Date.now()
    },
    playerName: {
        type: String,
        required: [true, 'Player name is required'],
        trim: true,
        maxlength: 50
    },
    score: {
        type: Number,
        required: [true, 'Quiz score is required'],
        min: 0,
        max: 500
    },
    totalQuestions: {
        type: Number,
        default: 5
    },
    rankTitle: {
        type: String,
        default: 'Orbital Explorer'
    },
    category: {
        type: String,
        default: 'Cosmic Astrophysics'
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('QuizScore', quizScoreSchema);

