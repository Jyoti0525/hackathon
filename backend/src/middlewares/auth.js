// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from the Authorization header
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user with the decoded id
        const user = await User.findOne({ 
            _id: decoded._id,
            'tokens.token': token 
        });

        if (!user) {
            throw new Error('No user found with this token');
        }

        // Add user and token to the request object
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
            error: error.message
        });
    }
};

module.exports = auth;