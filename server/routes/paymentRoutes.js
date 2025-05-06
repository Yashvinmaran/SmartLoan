// server/routes/paymentRoutes.js
// Routes for handling Razorpay payment verification.

const express = require('express');
const router = express.Router();
const {
  verifyPayment,
  paymentFailed,
} = require('../controllers/paymentController');

router.post('/verify', verifyPayment);
router.post('/failed', paymentFailed);

module.exports = router;