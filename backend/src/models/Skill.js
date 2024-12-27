// backend/src/models/Skill.js
const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['certificate', 'project', 'assessment', 'endorsement'],
        required: true
    },
    source: String,
    url: String,
    date: Date,
    score: Number,
    verified: {
        type: Boolean,
        default: false
    }
});

const progressSchema = new mongoose.Schema({
    level: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    lastAssessed: Date,
    history: [{
        level: Number,
        date: Date
    }]
});

const skillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
    },
    verifications: [verificationSchema],
    progress: progressSchema,
    endorsements: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        rating: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    projects: [{
        name: String,
        description: String,
        url: String,
        technologies: [String]
    }],
    learningResources: [{
        type: {
            type: String,
            enum: ['course', 'book', 'tutorial', 'project'],
            required: true
        },
        title: String,
        provider: String,
        url: String,
        status: {
            type: String,
            enum: ['planned', 'in-progress', 'completed'],
            default: 'planned'
        },
        completionDate: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

skillSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Skill', skillSchema);