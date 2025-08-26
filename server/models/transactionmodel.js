// Define Transaction Schema
const mongoose = require('mongoose')
const transactionSchema = new mongoose.Schema({
    sender_upi_id: { type: String, required: true },
    receiver_upi_id: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
