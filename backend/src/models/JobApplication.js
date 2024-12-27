const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'accepted', 'rejected'],
        default: 'pending'
    },
    resume: {
        type: String,
        required: true
    },
    coverLetter: String,
    matchScore: Number,
    feedback: String,
    appliedAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

jobApplicationSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);