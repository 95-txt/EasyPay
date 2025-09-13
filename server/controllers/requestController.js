const Request = require('../models/requestmodel');
const mongoose = require('mongoose');

// Create a new money request
exports.createRequest = async (req, res, next) => {
    try {
        const { target_upi_id, amount, note } = req.body;
        const requester_upi_id = req.user.upi_id;

        if (!requester_upi_id || !target_upi_id || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const request = new Request({ requester_upi_id, target_upi_id, amount, note });
        await request.save();
        res.status(201).json({ message: 'Request created', request });
    } catch (err) {
        next(err);
    }
};

// Get requests for a user (as target or requester)
exports.getRequests = async (req, res, next) => {
    try {
        const { upi_id } = req.params;
        const requests = await Request.find({
            $or: [
                { target_upi_id: upi_id },
                { requester_upi_id: upi_id }
            ]
        }).sort({ timestamp: -1 });
        // Always return 200 with array (empty or not)
        res.status(200).json(requests);
    } catch (err) {
        next(err);
    }
};

// Update request status (accept/decline)
exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        if (!['accepted', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // If accepting, trigger money transfer
        if (status === 'accepted') {
            // Import transaction controller inline to avoid circular deps
            const Transaction = require('../models/transactionmodel');
            const User = require('../models/usermodel');
            const { target_upi_id, requester_upi_id, amount, note } = request;
            // Check sender balance
            const sender = await User.findOne({ upi_id: target_upi_id });
            if (!sender) return res.status(404).json({ message: 'Sender not found' });
            if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance to fulfill request' });
            // Update balances
            await User.findOneAndUpdate({ upi_id: target_upi_id }, { $inc: { balance: -amount } });
            await User.findOneAndUpdate({ upi_id: requester_upi_id }, { $inc: { balance: amount } });
            // Create transaction
            const transaction = new Transaction({ sender_upi_id: target_upi_id, receiver_upi_id: requester_upi_id, amount, note });
            await transaction.save();
        }
        // Update request status
        request.status = status;
        await request.save();
        res.status(200).json({ message: 'Request updated', request });
    } catch (err) {
        next(err);
    }
};
