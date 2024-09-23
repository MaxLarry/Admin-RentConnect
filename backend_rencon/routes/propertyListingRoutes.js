const express = require('express');
const router = express.Router();
const ListingRequestProperty = require('../controllers/listingRequestController');

// Define route for fetching a pending request with the user name
//router.get('/listing-requests', ListingRequestController.getAllRequests);
router.get('/approved-properties', ListingRequestProperty.getAllApprovedListing);
router.get('/pending-requests', ListingRequestProperty.getAllPendingRequests);
router.get('/rejected-properties', ListingRequestProperty.getAllRejectedRequest);
router.put('/:id', ListingRequestProperty.updateRequestStatus);


router.delete('/deletion-properties', ListingRequestProperty.deletePropertiesWithRooms);

module.exports = router;