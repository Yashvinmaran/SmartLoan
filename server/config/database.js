// Establishes the connection to the MongoDB database using Mongoose.
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            console.error('MONGO_URI environment variable is not defined in .env file.');
            process.exit(1); // Exit if the URI is not found
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected successfully!');

    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1); // Exit if connection fails
    }
};

module.exports = connectDatabase;