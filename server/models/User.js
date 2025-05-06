// Defines the Mongoose schema for the User model.
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password: { type: String, required: true, minlength: 6 },
    aadhaar: { type: String, required: true, unique: true, trim: true },
    pan: { type: String, required: true, unique: true, trim: true, uppercase: true },
    phone: { type: String, required: true, unique: true, trim: true },
    cibilScore: { type: Number, min: 300, max: 900 },
    verified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    loanLimit: { type: Number, default: 0 },
    interestRate: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;