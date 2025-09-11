const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/me', authMiddleware, userController.getMe);
router.patch('/add-money', authMiddleware, userController.addMoney);

router.get('/all', authMiddleware, userController.getAllUsers);
router.get('/:upi_id', userController.getUser);

module.exports = router;
