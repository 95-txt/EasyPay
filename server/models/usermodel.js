// Define User Schema
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    upi_id: { type: String, unique: true },
    balance: { type: Number }
});

// export User Model
module.exports = mongoose.model('User', userSchema);