// backend/src/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        default: ''
    },
    rollNumber: {
        type: String,
        default: ''
    },
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    cgpa: {
        type: Number,
        default: 0
    },
    skills: {
        type: [String],
        default: []
    },
    applications: [{
        companyName: String,
        position: String,
        status: {
            type: String,
            enum: ['applied', 'under_review', 'selected', 'rejected'],
            default: 'applied'
        },
        appliedDate: {
            type: Date,
            default: Date.now
        }
    }],
    interviews: [{
        companyName: String,
        position: String,
        date: Date,
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled'
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);