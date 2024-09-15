const express = require('express');
const router = express.Router();
//const ListingRequestController = require('../controllers/listingRequestController');
const PendingRequestController = require('../controllers/listingRequestController');

// Define route for fetching a pending request with the user name
router.get('/pending-requests', PendingRequestController.getAllPendingRequests);
//router.get('/listing-requests', ListingRequestController.getAllRequests);

module.exports = router;