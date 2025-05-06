// server/controllers/adminController.js
// Controller functions for admin-specific actions.

const User = require('../models/User');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not retrieve users.' });
  }
};

// @desc    Get a specific user by ID (admin only)
// @route   GET /api/admin/users/:userId
// @access  Private (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found with ID ${req.params.userId}` });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid User ID format.' });
    }
    res.status(500).json({ success: false, error: 'Server Error: Could not retrieve the user.' });
  }
};

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:userId/role
// @access  Private (admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { isAdmin } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found with ID ${req.params.userId}` });
    }

    res.status(200).json({ success: true, data: user, message: 'User role updated successfully.' });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid User ID format.' });
    }
    res.status(500).json({ success: false, error: 'Server Error: Could not update user role.' });
  }
};