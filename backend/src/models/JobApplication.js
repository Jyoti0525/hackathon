// backend/src/models/JobApplication.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'under_review', 'shortlisted', 'rejected', 'selected'],
        default: 'applied'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    interviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);