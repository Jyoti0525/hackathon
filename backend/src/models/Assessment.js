const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'coding', 'short-answer'],
        required: true
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    points: {
        type: Number,
        default: 1
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    }
});

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    topic: {
        type: String,
        required: true
    },
    skillCategory: {
        type: String,
        required: true
    },
    timeLimit: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    questions: [questionSchema],
    passingScore: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'inactive'],
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Assessment = mongoose.model('Assessment', assessmentSchema);

module.export = Assessment;