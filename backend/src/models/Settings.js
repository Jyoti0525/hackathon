// backend/src/models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    notifications: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        systemNotifications: {
            type: Boolean,
            default: true
        },
        marketingEmails: {
            type: Boolean,
            default: false
        }
    },
    privacy: {
        profileVisibility: {
            type: String,
            enum: ['public', 'private', 'connections'],
            default: 'public'
        },
        dataSharing: {
            type: Boolean,
            default: true
        },
        activityTracking: {
            type: Boolean,
            default: true
        }
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);