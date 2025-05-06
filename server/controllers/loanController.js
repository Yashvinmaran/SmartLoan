// server/controllers/loanController.js
// Add this function to the existing exports in loanController.js

// @desc    Get all pending loan applications (admin only)
// @route   GET /api/admin/pending-loans
// @access  Private (admin)
exports.getPendingLoans = async (req, res) => {
  try {
    const pendingLoans = await LoanApplication.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: pendingLoans.length,
      data: pendingLoans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not retrieve pending loans.' });
  }
};

// @desc    Get all loan applications (admin only)
// @route   GET /api/admin/all-loans
// @access  Private (admin)
exports.getAllLoans = async (req, res) => {
  try {
    const allLoans = await LoanApplication.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: allLoans.length,
      data: allLoans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not retrieve all loans.' });
  }
};

// @desc    Verify a loan application (admin only)
// @route   PATCH /api/admin/verify-loan/:loanId
// @access  Private (admin)
exports.verifyLoan = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findByIdAndUpdate(
      req.params.loanId,
      { status: 'approved' },
      { new: true, runValidators: true }
    );

    if (!loanApplication) {
      return res.status(404).json({ success: false, error: `Loan application not found with ID ${req.params.loanId}` });
    }

    res.status(200).json({
      success: true,
      data: loanApplication,
      message: 'Loan application verified and approved.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not verify loan application.' });
  }
};

// @desc    Reject a loan application (admin only)
// @route   PATCH /api/admin/reject-loan/:loanId
// @access  Private (admin)
exports.rejectLoan = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findByIdAndUpdate(
      req.params.loanId,
      { status: 'rejected' },
      { new: true, runValidators: true }
    );

    if (!loanApplication) {
      return res.status(404).json({ success: false, error: `Loan application not found with ID ${req.params.loanId}` });
    }

    res.status(200).json({
      success: true,
      data: loanApplication,
      message: 'Loan application rejected.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not reject loan application.' });
  }
};

// @desc    Apply for a new loan
// @route   POST /api/loans/apply
// @access  Private (user)
exports.applyForLoan = async (req, res) => {
  try {
    // Validate request body here as needed

    const newLoanApplication = new LoanApplication({
      userId: req.user._id,
      loanAmount: req.body.loanAmount,
      loanPurpose: req.body.loanPurpose,
      status: 'pending',
    });

    const savedLoanApplication = await newLoanApplication.save();

    res.status(201).json({
      success: true,
      data: savedLoanApplication,
      message: 'Loan application submitted successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not submit loan application.' });
  }
};

// @desc    Initiate Razorpay payment for a loan
// @route   POST /api/loans/:loanId/payment
// @access  Private (user)
exports.initiatePayment = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findById(req.params.loanId).populate('userId');

    if (!loanApplication) {
      return res.status(404).json({ success: false, error: `Loan application not found with ID ${req.params.loanId}` });
    }

    if (loanApplication.userId.id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to initiate payment for this loan.' });
    }

    if (loanApplication.status !== 'approved') {
      return res.status(400).json({ success: false, error: 'Loan application must be approved before initiating payment.' });
    }

    const options = {
      amount: loanApplication.loanAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_${loanApplication._id}`,
    };

    const order = await razorpay.orders.create(options);

    loanApplication.status = 'payment_initiated';
    loanApplication.paymentId = order.id;
    await loanApplication.save();

    res.status(200).json({ success: true, data: { orderId: order.id, amount: options.amount } });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, error: 'Could not initiate payment.' });
  }
};

// @desc    Get loan application by ID
// @route   GET /api/loans/:loanId
// @access  Private (user/admin)
exports.getLoanById = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findById(req.params.loanId);

    if (!loanApplication) {
      return res.status(404).json({ success: false, error: `Loan application not found with ID ${req.params.loanId}` });
    }

    res.status(200).json({
      success: true,
      data: loanApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not retrieve loan application.' });
  }
};
