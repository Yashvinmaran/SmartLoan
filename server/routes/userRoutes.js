// Defines the routes for regular users, protected by the verifyToken and isUser middleware.
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isUser, protect: verifyToken } = require('../middleware/authMiddleware');

// Apply for a loan
router.post('/apply-loan', verifyToken, isUser, userController.applyLoan);

// Get user's loan applications
router.get('/loan-applications', verifyToken, isUser, userController.getUserLoanApplications);

// Get user's dashboard data
router.get('/dashboard', verifyToken, isUser, userController.getUserDashboard);

module.exports = router;