// controllers/listingRequestController.js
const PropertyListService = require("../services/ListingRequest.services");

// Get all Approved Listing Properties
async function getAllApprovedListing(req, res) {
  try {
    const requests = await PropertyListService.getAllApprovedListing();

    if (!requests.length) {
      return res.json({ message: "No data available" });
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
      return res.json({ message: "No data available" });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching listing requests:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllRejectedRequest(req, res) {
  try {
    const requests = await PropertyListService.getAllRejectedRequest();

    if (!requests.length) {
      return res.json({ message: "No data available" });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching Rejected requests:", error);
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

//deletion of Properties With Rooms
const deletePropertiesWithRooms = async (req, res) => {
  const { ids } = req.body; // Get the array of property IDs from the request body

  if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No property IDs provided for deletion' });
  }

  try {
      // Step 1: Delete the rooms associated with the properties
      await Room.deleteMany({ propertyId: { $in: ids } });

      // Step 2: Delete the properties
      const result = await PropertyList.deleteMany({ _id: { $in: ids } });

      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'No properties found for the given IDs' });
      }

      return res.status(200).json({ message: 'Properties and associated rooms deleted successfully' });
  } catch (error) {
      console.error("Error deleting properties and rooms:", error);
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  getAllPendingRequests,
  getAllApprovedListing,
  getAllRejectedRequest,
  updateRequestStatus,
  deletePropertiesWithRooms
};
