// backend/src/models/StudentProfile.js
const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        dateOfBirth: Date,
        address: String,
        gender: String
    },
    academicInfo: {
        department: { type: String, required: true },
        year: { type: Number, required: true },
        semester: Number,
        rollNumber: String,
        cgpa: Number
    },
    educationalBackground: {
        highSchool: {
            name: String,
            board: String,
            percentage: Number,
            yearOfCompletion: Number
        },
        intermediary: {
            name: String,
            board: String,
            percentage: Number,
            yearOfCompletion: Number
        }
    },
    socialLinks: {
        linkedin: String,
        github: String,
        portfolio: String
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);