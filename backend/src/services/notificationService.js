// backend/src/services/notificationService.js
const WebSocket = require('ws');
const User = require('../models/User');

class NotificationService {
    constructor() {
        this.connections = new Map();
        this.notificationQueue = new Map();
    }

    initialize(server) {
        const wss = new WebSocket.Server({ server });

        wss.on('connection', (ws, req) => {
            const userId = this.extractUserId(req);
            if (userId) {
                this.connections.set(userId, ws);
                this.sendQueuedNotifications(userId);

                ws.on('close', () => {
                    this.connections.delete(userId);
                });
            }
        });
    }

    async sendNotification(userId, notification) {
        try {
            const connection = this.connections.get(userId);
            const formattedNotification = {
                id: Date.now(),
                timestamp: new Date(),
                ...notification
            };

            if (connection && connection.readyState === WebSocket.OPEN) {
                connection.send(JSON.stringify(formattedNotification));
            } else {
                this.queueNotification(userId, formattedNotification);
            }

            await this.saveNotification(userId, formattedNotification);
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    async sendBulkNotifications(userIds, notification) {
        const promises = userIds.map(userId => 
            this.sendNotification(userId, notification)
        );
        await Promise.all(promises);
    }

    queueNotification(userId, notification) {
        if (!this.notificationQueue.has(userId)) {
            this.notificationQueue.set(userId, []);
        }
        this.notificationQueue.get(userId).push(notification);
    }

    async sendQueuedNotifications(userId) {
        const queuedNotifications = this.notificationQueue.get(userId) || [];
        const connection = this.connections.get(userId);

        if (connection && connection.readyState === WebSocket.OPEN) {
            queuedNotifications.forEach(notification => {
                connection.send(JSON.stringify(notification));
            });
            this.notificationQueue.delete(userId);
        }
    }

    async generateAINotifications(userId, data) {
        try {
            const user = await User.findById(userId);
            const notifications = [];

            // Job Match Notifications
            if (data.newJobs) {
                const jobMatches = await this.analyzeJobMatches(user, data.newJobs);
                jobMatches.forEach(match => {
                    notifications.push({
                        type: 'jobMatch',
                        title: 'New Job Match',
                        content: `A new ${match.role} position matches your profile (${match.matchScore}% match)`,
                        priority: match.matchScore > 80 ? 'high' : 'medium',
                        data: match
                    });
                });
            }

            // Skill Development Notifications
            if (data.skillUpdates) {
                const skillSuggestions = await this.analyzeSkillGaps(user, data.skillUpdates);
                skillSuggestions.forEach(suggestion => {
                    notifications.push({
                        type: 'skillDevelopment',
                        title: 'Skill Development Opportunity',
                        content: suggestion.message,
                        priority: suggestion.priority,
                        data: suggestion
                    });
                });
            }

            // Assessment Reminders
            if (data.pendingAssessments) {
                notifications.push({
                    type: 'assessment',
                    title: 'Assessment Reminder',
                    content: 'You have pending assessments to complete',
                    priority: 'medium',
                    data: data.pendingAssessments
                });
            }

            return notifications;
        } catch (error) {
            console.error('Failed to generate AI notifications:', error);
            return [];
        }
    }

    async analyzeJobMatches(user, jobs) {
        // Implementation of job matching analysis
        return [];
    }

    async analyzeSkillGaps(user, updates) {
        // Implementation of skill gap analysis
        return [];
    }

    async saveNotification(userId, notification) {
        // Implementation of notification persistence
    }

    extractUserId(req) {
        // Implementation of user ID extraction from request
        return null;
    }
}

module.exports = new NotificationService();