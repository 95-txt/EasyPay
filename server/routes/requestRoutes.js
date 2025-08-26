const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Create a new request
router.post('/', requestController.createRequest);
// Get all requests for a user (as requester or target)
router.get('/:upi_id', requestController.getRequests);
// Update request status (accept/decline)
router.patch('/:requestId', requestController.updateRequestStatus);

module.exports = router;
