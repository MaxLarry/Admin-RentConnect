// controllers/listingRequestController.js
const PendingService = require('../services/ListingRequest.services');

// Get all listing requests
async function getAllRequests(req, res) {
  try {
    const requests = await ListingRequest.find()
      .populate('ownerName', 'name')
      .exec();

    if (!requests.length) {
      return res.status(404).json({ message: 'No data available' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Error fetching listing requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Controller to get a pending request by ID
// Get all listing requests with profiles
async function getAllPendingRequests(req, res) {
  try {
    const requests = await PendingService.getAllPendingRequestsWithProfiles();

    if (!requests.length) {
      return res.status(404).json({ message: 'No data available' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Error fetching listing requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
module.exports = {
  getAllRequests,
  getAllPendingRequests,
};
