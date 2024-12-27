const mongoose = require('mongoose');


const assessmentResultSchema = new mongoose.Schema({
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        points: Number
    }],
    score: {
        type: Number,
        default: 0
    },
    feedback: [{
        type: String
    }],
    startTime: {
        type: Date,
        required: true
    },
    endTime: Date,
    timeTaken: Number,
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'expired'],
        default: 'in-progress'
    }
});

assessmentResultSchema.pre('save', function(next) {
    if (this.endTime) {
        this.timeTaken = (this.endTime - this.startTime) / 1000; // in seconds
        this.status = 'completed';
    }
    next();
});


const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

module.exports = AssessmentResult;