// Define Request Schema
const mongoose = require('mongoose')
const requestSchema = new mongoose.Schema({
    requester_upi_id: { type: String, required: true }, // who is requesting
    target_upi_id: { type: String, required: true },    // who is being asked
    amount: { type: Number, required: true },
    note: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
