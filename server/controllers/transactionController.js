const User = require('../models/usermodel');
const Transaction = require('../models/transactionmodel');
const mongoose = require('mongoose');

// Create transaction (atomic)
exports.createTransaction = async (req, res, next) => {
    try {
        const { receiver_upi_id, amount, note } = req.body;
        const sender_upi_id = req.user.upi_id; // <- comes from JWT

        if (!sender_upi_id) return res.status(401).json({ message: 'Unauthorized' });
        if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

        const sender = await User.findOne({ upi_id: sender_upi_id });
        if (!sender) return res.status(404).json({ message: 'Sender not found' });
        if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

        const receiver = await User.findOne({ upi_id: receiver_upi_id });
        if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

        await User.findOneAndUpdate({ upi_id: sender_upi_id }, { $inc: { balance: -amount } });
        await User.findOneAndUpdate({ upi_id: receiver_upi_id }, { $inc: { balance: amount } });

        const transaction = new Transaction({ sender_upi_id, receiver_upi_id, amount, note });
        await transaction.save();

        res.status(200).json({ message: 'Transaction successful!' });
    } catch (err) {
        next(err);
    }
};

// Get transactions for a user
exports.getTransactions = async (req, res, next) => {
    try {
        const { upi_id } = req.params;
        const transactions = await Transaction.find({
            $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }]
        }).sort({ timestamp: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        next(err);
    }
};
