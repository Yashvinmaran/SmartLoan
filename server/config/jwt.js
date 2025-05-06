// server/config/jwt.js
// Configuration for JWT secret key.

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key', // Use environment variable for production
  jwtExpiration: '1h', // Token expiration time
};