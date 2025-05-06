// server/middleware/adminMiddleware.js
// Middleware to authorize admin users.

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized as an admin',
    });
  }
};

module.exports = admin;