// server/controllers/paymentController.js
const crypto = require('crypto');
const LoanApplication = require('../models/LoanApplication');

// @desc    Verify Razorpay payment signature and update loan status
// @route   POST /api/payments/verify
// @access  Public (Razorpay webhook - ensure proper security)
exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, razorpay_signature, loanApplicationId } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment successful, update loan application status and store details
      const loanApplication = await LoanApplication.findByIdAndUpdate(
        loanApplicationId,
        {
          status: 'payment_verified',
          paymentId: payment_id,
          paymentSignature: razorpay_signature,
        },
        { new: true }
      );

      if (loanApplication) {
        return res.status(200).json({ success: true, message: 'Payment successful, loan status updated to verified.' });
      } else {
        return res.status(404).json({ success: false, error: 'Loan application not found for status update.' });
      }
    } else {
      // Signature verification failed
      return res.status(400).json({ success: false, error: 'Payment signature verification failed.' });
    }
  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ success: false, error: 'Server error during payment verification.' });
  }
};

// @desc    Handle payment failure (optional - for logging or specific actions)
// @route   POST /api/payments/failed
// @access  Public (Razorpay webhook)
exports.paymentFailed = (req, res) => {
  console.log('Payment Failed:', req.body);
  res.status(200).json({ success: true, message: 'Payment failed notification received.' });
  // Implement any specific failure handling logic here (e.g., sending email to user, updating loan status to 'payment_failed')
};