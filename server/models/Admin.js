// Defines the Mongoose schema for the Admin model.
const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;