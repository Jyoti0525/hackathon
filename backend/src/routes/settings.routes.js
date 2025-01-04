// backend/src/routes/settings.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Settings = require('../models/Settings');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user settings
router.get('/settings', auth, async (req, res) => {
    try {
        let settings = await Settings.findOne({ userId: req.user._id });
        
        if (!settings) {
            // Create default settings if none exist
            settings = new Settings({
                userId: req.user._id
            });
            await settings.save();
        }

        res.json({
            success: true,
            data: settings
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

// Update notification settings
router.put('/settings/notifications', auth, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            { userId: req.user._id },
            { 
                $set: { 
                    notifications: req.body,
                    lastUpdated: new Date()
                }
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating notification settings',
            error: error.message
        });
    }
});

// Update privacy settings
router.put('/settings/privacy', auth, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            { userId: req.user._id },
            { 
                $set: { 
                    privacy: req.body,
                    lastUpdated: new Date()
                }
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating privacy settings',
            error: error.message
        });
    }
});

// Change password
router.put('/settings/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
});

module.exports = router;