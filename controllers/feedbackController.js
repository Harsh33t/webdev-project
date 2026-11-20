/**
 * controllers/feedbackController.js
 * Controller handling public feedbacks, reviews, and community testimonials.
 * Part of Solar Explorer MVC Architecture.
 */
const StorageService = require('../services/storageService');

/**
 * List all reviews with optional topic and rating filters
 * GET /api/feedback
 */
async function getFeedbacks(req, res) {
    try {
        const { topic, rating } = req.query;
        const feedbacks = await StorageService.getFeedbacks({ topic, rating });
        res.json({
            success: true,
            count: feedbacks.length,
            storage: StorageService.getSystemStats ? 'active' : 'fallback',
            data: feedbacks
        });
    } catch (err) {
        console.error('[feedbackController] Error fetching feedbacks:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve feedback entries' });
    }
}

/**
 * Submit new community feedback or mission review
 * POST /api/feedback
 */
async function submitFeedback(req, res) {
    try {
        const { name, email, topic, rating, feedback } = req.body;
        if (!name || !email || !feedback) {
            return res.status(400).json({
                success: false,
                error: 'Required fields missing: name, email, and feedback message are mandatory.'
            });
        }
        const created = await StorageService.createFeedback({
            name: name.trim(),
            email: email.trim(),
            topic: topic || 'General Inquiry',
            rating: Number(rating) || 5,
            feedback: feedback.trim()
        });
        res.status(201).json({
            success: true,
            message: 'Feedback submitted and persisted successfully.',
            data: created
        });
    } catch (err) {
        console.error('[feedbackController] Error creating feedback:', err);
        res.status(500).json({ success: false, error: 'Database write error' });
    }
}

/**
 * Delete feedback entry by ID
 * DELETE /api/feedback/:id
 */
async function deleteFeedback(req, res) {
    try {
        const deleted = await StorageService.deleteFeedback(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Feedback record not found.' });
        }
        res.json({ success: true, message: 'Feedback entry deleted.', data: deleted });
    } catch (err) {
        console.error('[feedbackController] Error deleting feedback:', err);
        res.status(500).json({ success: false, error: 'Database delete operation failed' });
    }
}

module.exports = {
    getFeedbacks,
    submitFeedback,
    createFeedback: submitFeedback,
    deleteFeedback
};
