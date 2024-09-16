const express = require('express');
const router = express.Router();
const ApprovedListingtController = require('../controllers/listingRequestController');
const PendingRequestController = require('../controllers/listingRequestController');
const requestController = require('../controllers/listingRequestController');

// Define route for fetching a pending request with the user name
router.get('/pending-requests', PendingRequestController.getAllPendingRequests);
//router.get('/listing-requests', ListingRequestController.getAllRequests);
router.get('/approved-properties', ApprovedListingtController.getAllApprovedListing);
router.put('/:id', requestController.updateRequestStatus);

module.exports = router;