const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create a new request
router.post('/', authMiddleware, requestController.createRequest);
// Get all requests for logged-in user
router.get('/me', authMiddleware, requestController.getRequests);
// Update request status (accept/decline)
router.patch('/:requestId', authMiddleware, requestController.updateRequestStatus);

module.exports = router;
