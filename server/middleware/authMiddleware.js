// server/middleware/authMiddleware.js
// Middleware to protect user routes by verifying JWT tokens.

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized, token failed',
    });
  }
};

const isUser = (req, res, next) => {
  if (req.user && !req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized as a user',
    });
  }
};

module.exports = { protect, isUser };
