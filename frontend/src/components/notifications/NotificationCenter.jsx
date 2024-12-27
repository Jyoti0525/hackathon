// src/components/notifications/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Badge,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemText,
    Typography,
    Button,
    Divider,
    Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        initializeWebSocket();
        fetchNotifications();
        return () => {
            if (webSocket) {
                webSocket.close();
            }
        };
    }, []);

    const initializeWebSocket = () => {
        const ws = new WebSocket(`ws://${window.location.host}/ws/notifications`);
        
        ws.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            handleNewNotification(notification);
        };

        ws.onclose = () => {
            setTimeout(initializeWebSocket, 3000);
        };

        setWebSocket(ws);
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications');
            const data = await response.json();
            if (data.success) {
                setNotifications(data.data);
                updateUnreadCount(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showNotificationAlert(notification);
    };

    const showNotificationAlert = (notification) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.content,
                icon: '/notification-icon.png'
            });
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT'
            });
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, read: true }
                        : notif
                )
            );
            updateUnreadCount(notifications);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const updateUnreadCount = (notifs) => {
        const count = notifs.filter(n => !n.read).length;
        setUnreadCount(count);
    };

    const open = Boolean(anchorEl);

    const renderNotification = (notification) => {
        switch (notification.type) {
            case 'jobMatch':
                return (
                    <Alert severity="success" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">
                            {notification.title}
                        </Typography>
                        <Typography variant="body2">
                            {notification.content}
                        </Typography>
                        <Button size="small" sx={{ mt: 1 }}>
                            View Job
                        </Button>
                    </Alert>
                );
            case 'skillDevelopment':
                return (
                    <Alert severity="info" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">
                            {notification.title}
                        </Typography>
                        <Typography variant="body2">
                            {notification.content}
                        </Typography>
                        <Button size="small" sx={{ mt: 1 }}>
                            Start Learning
                        </Button>
                    </Alert>
                );
            case 'assessment':
                return (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">
                            {notification.title}
                        </Typography>
                        <Typography variant="body2">
                            {notification.content}
                        </Typography>
                        <Button size="small" sx={{ mt: 1 }}>
                            Take Assessment
                        </Button>
                    </Alert>
                );
            default:
                return (
                    <ListItem>
                        <ListItemText
                            primary={notification.title}
                            secondary={notification.content}
                        />
                    </ListItem>
                );
        }
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ width: 400, maxHeight: 500, overflow: 'auto' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6">Notifications</Typography>
                    </Box>

                    {notifications.length === 0 ? (
                        <Box sx={{ p: 2 }}>
                            <Typography color="textSecondary">
                                No notifications
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {notifications.map((notification) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem
                                        onClick={() => markAsRead(notification.id)}
                                        sx={{
                                            bgcolor: notification.read
                                                ? 'transparent'
                                                : 'action.hover',
                                        }}
                                    >
                                        {renderNotification(notification)}
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default NotificationCenter;