// controllers/listingRequestController.js
const PropertyListService = require("../services/ListingRequest.services");

// Get all Approved Listing Properties
async function getAllApprovedListing(req, res) {
  try {
    const requests = await PropertyListService.getAllApprovedListing();

    if (!requests.length) {
      return res.status(404).json({ message: "No data available" });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching Approved Properties:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Controller to get a pending request by ID
// Get all listing requests with profiles
async function getAllPendingRequests(req, res) {
  try {
    const requests = await PropertyListService.getAllPendingRequestsWithProfiles();

    if (!requests.length) {
      return res.status(404).json({ message: "No data available" });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching listing requests:", error);
    res.status(500).json({ message: "Server error" });
  }
}



const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await PropertyListService.updateRequestStatus(id, status);
    res.json(updatedRequest);
  } catch (error) {
    console.error(`Error updating status for request with ID: ${id}`, error);
    if (error.message === "Status is required") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Request not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getAllPendingRequests,
  updateRequestStatus,
  getAllApprovedListing,
};
