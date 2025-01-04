// backend/src/controllers/profile.controller.js
const StudentProfile = require('../models/StudentProfile');

exports.getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user._id });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updatedProfile = await StudentProfile.findOneAndUpdate(
            { userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};