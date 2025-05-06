// Main entry point for the backend server using Node.js and Express.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const loanRoutes = require('./routes/loanRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { protect } = require('./middleware/authMiddleware');

require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
connectDatabase();

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', protect, userRoutes); // Protect user routes
app.use('/api/admin', protect, adminRoutes); // Protect admin routes
app.use('/api/loans', protect, loanRoutes);   // Protect loan routes
app.use('/api/payments', protect, paymentRoutes); // Protect payment routes

app.get('/', (req, res) => {
  res.send('Microloan Web App Backend is running!');
});

// Use global error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
