// Add money to user balance
exports.addMoney = async (req, res, next) => {
    try {
        const { upi_id } = req.params;
        const { amount } = req.body;
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const user = await User.findOneAndUpdate(
            { upi_id },
            { $inc: { balance: Number(amount) } },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Money added', user });
    } catch (err) {
        next(err);
    }
};
// Get all users (for name search)
exports.getAllUsers = async (req, res, next) => {
    try {
        // Exclude password from results
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};
const e = require('express');
const User = require('../models/usermodel');
const generateUPI = require('../utils/upiGenerator');
const bcrypt = require('bcrypt');

// Signup
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });
        const upi_id = generateUPI(name);
        const balance = 1000;
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, upi_id, balance });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!', upi_id });
    } catch (err) {
        next(err);
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });
        res.status(200).json({ message: 'Login successful!', upi_id: user.upi_id, balance: user.balance });
    } catch (err) {
        //next(err);
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
};

// Fetch user details
exports.getUser = async (req, res, next) => {
    try {
        const { upi_id } = req.params;
        const user = await User.findOne({ upi_id }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
