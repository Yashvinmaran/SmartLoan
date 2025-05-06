// server/routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const {
  applyForLoan,
  verifyLoan,
  getAllLoans,
  getLoanById,
  initiatePayment,
} = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.post('/apply', protect, applyForLoan);
router.post('/:loanId/payment', protect, initiatePayment); // New route to initiate payment
router.put('/:loanId/verify', protect, admin, verifyLoan);
router.get('/', protect, admin, getAllLoans);
router.get('/:loanId', protect, getLoanById);

module.exports = router;