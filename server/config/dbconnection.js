const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// Connect to MongoDB
const mongoose = require("mongoose")
const dbconnect = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = { dbconnect } 