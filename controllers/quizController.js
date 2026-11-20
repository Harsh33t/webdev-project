/**
 * controllers/quizController.js
 * Controller handling cosmic astrophysics quiz, leaderboards, and scoring.
 * Part of Solar Explorer MVC Architecture.
 */
const StorageService = require('../services/storageService');

// Curated cosmic quiz pool
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "What is the speed of light in a cosmic vacuum?",
        options: [
            "150,000 km/s",
            "299,792 km/s",
            "1,080,000 km/h",
            "500,000 km/s"
        ],
        correctIndex: 1,
        points: 100,
        explanation: "In a vacuum, light propagates at exactly 299,792,458 m/s (~299,792 km/s), defined by universal constant c."
    },
    {
        id: 2,
        question: "How long does sunlight take to travel 1 Astronomical Unit (AU) to Earth?",
        options: [
            "8 minutes and 20 seconds",
            "1 second",
            "3 hours",
            "24 hours"
        ],
        correctIndex: 0,
        points: 100,
        explanation: "1 AU is ~149.6 million kilometers. At c, photons take approximately 499 seconds (~8m 20s) to arrive."
    },
    {
        id: 3,
        question: "What lies at the gravitational barycenter of the Milky Way galaxy?",
        options: [
            "Proxima Centauri",
            "Sagittarius A* Supermassive Black Hole",
            "The Crab Nebula",
            "Betelgeuse"
        ],
        correctIndex: 1,
        points: 100,
        explanation: "Sagittarius A* is a supermassive black hole with a mass of roughly 4.15 million solar masses."
    },
    {
        id: 4,
        question: "What is the primary nuclear fusion cycle fueling our Sun during its main sequence?",
        options: [
            "CNO Cycle",
            "Proton-Proton (p-p) Chain Reaction",
            "Triple-Alpha Process",
            "Helium Burning Phase"
        ],
        correctIndex: 1,
        points: 100,
        explanation: "The Proton-Proton chain fuses ~600 million tons of hydrogen into helium every second in the solar core."
    },
    {
        id: 5,
        question: "At what altitude range does the International Space Station (ISS) maintain orbit?",
        options: [
            "50 - 100 km (Kármán line)",
            "400 - 430 km (Low Earth Orbit)",
            "20,200 km (Medium Earth Orbit)",
            "35,786 km (Geostationary Orbit)"
        ],
        correctIndex: 1,
        points: 100,
        explanation: "The ISS orbits in LEO between 400 and 430 km altitude with an inclination of 51.64 degrees."
    }
];

/**
 * Get sanitized questions pool (without answers/explanations)
 * GET /api/quiz
 */
function getQuizQuestions(req, res) {
    const sanitized = QUIZ_QUESTIONS.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        points: q.points
    }));
    res.json({ success: true, count: sanitized.length, questions: sanitized });
}

/**
 * Get top leaderboard scores
 * GET /api/quiz/leaderboard
 */
async function getLeaderboard(req, res) {
    try {
        const top = await StorageService.getQuizScores(10);
        res.json({ success: true, data: top });
    } catch (err) {
        console.error('[quizController] Error fetching leaderboard:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve quiz leaderboard' });
    }
}

/**
 * Grade quiz submission, assign rank, and persist score
 * POST /api/quiz/submit
 */
async function submitQuizScore(req, res) {
    try {
        const { playerName, answers } = req.body;
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ success: false, error: 'Answers payload missing or invalid' });
        }

        let totalScore = 0;
        let correctCount = 0;
        const review = [];

        QUIZ_QUESTIONS.forEach(q => {
            const userAnswer = answers[q.id];
            const isCorrect = Number(userAnswer) === q.correctIndex;
            if (isCorrect) {
                totalScore += q.points;
                correctCount++;
            }
            review.push({
                questionId: q.id,
                question: q.question,
                userAnswer: userAnswer !== undefined ? q.options[userAnswer] : 'No Answer',
                correctAnswer: q.options[q.correctIndex],
                isCorrect: isCorrect,
                explanation: q.explanation
            });
        });

        // Determine cosmic rank title based on score
        let rankTitle = 'Space Cadet';
        if (totalScore >= 500) rankTitle = 'Chief Galactic Astrophysicist';
        else if (totalScore >= 400) rankTitle = 'Senior Flight Director';
        else if (totalScore >= 300) rankTitle = 'Orbital Navigator';
        else if (totalScore >= 200) rankTitle = 'Spacecraft Pilot';

        const record = await StorageService.createQuizScore({
            playerName: (playerName && playerName.trim()) || 'Anonymous Explorer',
            score: totalScore,
            totalQuestions: QUIZ_QUESTIONS.length,
            rankTitle: rankTitle,
            category: 'Cosmic Astrophysics'
        });

        res.json({
            success: true,
            score: totalScore,
            maxScore: QUIZ_QUESTIONS.length * 100,
            correctCount: correctCount,
            totalQuestions: QUIZ_QUESTIONS.length,
            rankTitle: rankTitle,
            review: review,
            savedRecord: record
        });
    } catch (err) {
        console.error('[quizController] Error submitting quiz:', err);
        res.status(500).json({ success: false, error: 'Failed to evaluate and save quiz score' });
    }
}

module.exports = {
    getQuizQuestions,
    getQuestions: getQuizQuestions,
    getLeaderboard,
    submitQuizScore,
    QUIZ_QUESTIONS
};
