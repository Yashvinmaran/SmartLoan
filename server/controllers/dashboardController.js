// server/controllers/dashboardController.js

const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');

// @desc    Get user dashboard data
// @route   GET /api/dashboard
// @access  Private (user)
exports.getUserDashboardData = async (req, res) => {
  // ... (rest of the getUserDashboardData function remains the same)
};

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (admin)
exports.getAdminDashboardData = async (req, res) => {
  try {
    const totalApplications = await LoanApplication.countDocuments();
    const pendingApplications = await LoanApplication.countDocuments({ status: 'pending' });
    const approvedApplications = await LoanApplication.countDocuments({ status: 'approved' });
    const rejectedApplications = await LoanApplication.countDocuments({ status: 'rejected' });
    const paymentInitiatedApplications = await LoanApplication.countDocuments({ status: 'payment_initiated' });
    const paymentVerifiedApplications = await LoanApplication.countDocuments({ status: 'payment_verified' });
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const recentApplications = await LoanApplication.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'username email');

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        paymentInitiatedApplications,
        paymentVerifiedApplications,
        totalUsers,
        totalAdmins,
        recentApplications,
        // Add other relevant admin data here
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not retrieve admin dashboard data.' });
  }
};