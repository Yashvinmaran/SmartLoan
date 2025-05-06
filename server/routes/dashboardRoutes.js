// server/routes/dashboardRoutes.js
// Routes for fetching dashboard data.

const express = require('express');
const router = express.Router();
const {
  getUserDashboardData,
  getAdminDashboardData,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', protect, getUserDashboardData);
router.get('/admin', protect, admin, getAdminDashboardData);

module.exports = router;