const e = require('express');
const User = require('../models/usermodel');
const generateUPI = require('../utils/upiGenerator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get current logged-in user (via JWT)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Add money to user balance
exports.addMoney = async (req, res, next) => {
    try {
        const { amount } = req.body;

        // Validate amount
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Find logged-in user (from JWT middleware)
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { balance: Number(amount) } },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Money added", balance: user.balance });
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

// Signup
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const upi_id = generateUPI(name);
        const balance = 1000;

        user = new User({ name, email, password: hashedPassword, upi_id, balance });
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });
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
        if (!match) return res.status(400).json({ message: 'Invalid Password' });

        const token = jwt.sign(
            { id: user._id, email: user.email, upi_id: user.upi_id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
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
        res.status(500).json({ message: "Server error" });
    }
};
