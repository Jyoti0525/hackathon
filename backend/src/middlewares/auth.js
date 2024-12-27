// middlewares/auth.js
const jwt = require('jsonwebtoken');

// middlewares/auth.js
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Add this console log to debug
    console.log('Decoded user:', decoded);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = auth;