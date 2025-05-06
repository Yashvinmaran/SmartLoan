// Defines the routes for administrators, protected by the verifyToken and isAdmin middleware.
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const loanController = require('../controllers/loanController');
const { protect: verifyToken } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Get all pending loan applications
router.get('/pending-loans', verifyToken, admin, loanController.getPendingLoans);

// Get all loan applications
router.get('/all-loans', verifyToken, admin, loanController.getAllLoans);

// Verify a loan application
router.patch('/verify-loan/:loanId', verifyToken, admin, loanController.verifyLoan);

// Reject a loan application
router.patch('/reject-loan/:loanId', verifyToken, admin, loanController.rejectLoan);

// Get all users
router.get('/users', verifyToken, admin, adminController.getAllUsers);

module.exports = router;