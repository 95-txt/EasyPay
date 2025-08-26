const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Get all users (for name search)

// Add money to user balance
router.patch('/:upi_id/add-money', userController.addMoney);

router.get('/all', userController.getAllUsers);
router.get('/:upi_id', userController.getUser);

module.exports = router;