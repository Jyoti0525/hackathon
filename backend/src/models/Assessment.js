// backend/src/models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: String,
    duration: {
        type: Number,  // in minutes
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    questions: [{
        questionText: String,
        options: [String],
        correctAnswer: String,
        marks: Number
    }],
    status: {
        type: String,
        enum: ['pending', 'ongoing', 'completed', 'upcoming'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    submittedAt: Date,
    startedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);