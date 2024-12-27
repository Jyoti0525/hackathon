// backend/src/controllers/notificationController.js
const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await notificationService.getUserNotifications(userId);
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;
        await notificationService.markNotificationAsRead(userId, notificationId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

