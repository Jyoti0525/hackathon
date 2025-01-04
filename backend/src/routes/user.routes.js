// backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');

// Get user settings
router.get('/user/settings', auth, async (req, res) => {
    try {
        // Find user settings or create default ones
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return default settings if none exist
        const defaultSettings = {
            notifications: {
                emailNotifications: true,
                systemNotifications: true,
                marketingEmails: false
            },
            privacy: {
                profileVisibility: 'public',
                dataSharing: true,
                activityTracking: true
            }
        };

        res.json({
            success: true,
            data: user.settings || defaultSettings
        });
    } catch (error) {
        console.error('Settings fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching settings',
            error: error.message
        });
    }
});

module.exports = router;