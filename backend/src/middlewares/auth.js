// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token payload:', decoded); // Debugging line

            const user = await User.findById(decoded.userId);
            console.log('Found user:', user ? 'Yes' : 'No'); // Debugging line

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found in the system'
                });
            }

            req.user = user;
            req.token = token;
            next();
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError);
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
                error: jwtError.message
            });
        }
    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server authentication error',
            error: error.message
        });
    }
};

module.exports = auth;