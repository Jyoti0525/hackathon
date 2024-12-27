// backend/src/models/Interview.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['technical', 'behavioral', 'situational'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    topic: String,
    expectedAnswerPoints: [String],
    followUpQuestions: [String]
});

const responseSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    evaluation: {
        score: Number,
        feedback: String,
        strengths: [String],
        improvements: [String]
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    type: {
        type: String,
        enum: ['practice', 'mock', 'real'],
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    questions: [questionSchema],
    responses: [responseSchema],
    feedback: {
        overallScore: Number,
        strengths: [String],
        improvements: [String],
        recommendations: [String]
    },
    preferences: {
        duration: Number,
        difficulty: String,
        topics: [String],
        focusAreas: [String]
    },
    scheduledAt: Date,
    startedAt: Date,
    completedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

interviewSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Interview', interviewSchema);