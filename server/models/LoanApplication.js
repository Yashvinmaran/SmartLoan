// server/models/LoanApplication.js
const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loanAmount: {
    type: Number,
    required: [true, 'Please provide the loan amount'],
  },
  loanTerm: {
    type: Number,
    required: [true, 'Please provide the loan term in months'],
  },
  purpose: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'payment_initiated', 'payment_verified'],
    default: 'pending',
  },
  paymentId: {
    type: String,
    trim: true,
  },
  paymentSignature: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);