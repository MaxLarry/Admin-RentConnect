const UserProfileRequestService = require("../services/UserRequest.services");


async function getAlluserProfileRequest(req, res) {
    try {
      const requests = await UserProfileRequestService.getAllUserRequests();
  
      if (!requests.length) {
        return res.status(404).json({ message: 'No data available' });
      }
  
      res.json(requests);
    } catch (error) {
      console.error('Error fetching user profile requests:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  module.exports = {
    getAlluserProfileRequest,
  };

  