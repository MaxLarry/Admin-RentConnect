const UserProfileRequestService = require("../services/UserList.services");
const userAdminService = require("../services/UserList.service");

async function getAlluserProfileRequest(req, res) {
  try {
    const requests = await UserProfileRequestService.getAllUserRequests();

    if (!requests.length) {
      return res.status(404).json({ message: "No data available" });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching user profile requests:", error);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  getAlluserProfileRequest,
};

// Fetch all admin users
const fetchAdmins = async (req, res) => {
  try {
    const admins = await userAdminService.getAllAdmins();
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }
    // Map through the admins and concatenate first_name and last_name
    const adminsWithFullName = admins.map((admin) => ({
      ...admin._doc, // Keep other properties of the admin object
      fullName: `${admin.first_name} ${admin.last_name}`, // Concatenate first_name and last_name
    }));

    res.status(200).json(adminsWithFullName);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};

module.exports = {
  fetchAdmins,
};
