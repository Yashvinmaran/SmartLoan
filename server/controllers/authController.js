// server/controllers/authController.js
// Controller functions for user and admin authentication (login/register).

const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ success: false, error: 'Username already taken' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error: Could not register user' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide an email and password' });
  }

  try {
    // Check for user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not log in user' });
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide an email and password' });
  }

  try {
    // Check for admin user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isAdmin) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error: Could not log in admin' });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
};