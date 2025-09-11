const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/:upi_id', transactionController.getTransactions);

module.exports = router; 