const userListService = require("../services/UserList.service");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");


/*
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
};*/

// Fetch all landlords users
async function fetchAllLandlords(req, res) {
  try {
    const landlords = await userListService.getAllLandlords();

    if (landlords.length === 0) {
      return res.json({ message: "No data available" });
    }

    res.json(landlords);
  } catch (error) {
    console.error("Error fetching list of Landlords:", error);
    res.status(500).json({ message: "Server error" });
  }
};

async function fetchAllOccupants(req, res) {
  try {
    const occupants = await userListService.getAllOccupants();

    if (occupants.length === 0) {
      return res.json({ message: "No data available" });
    }

    res.json(occupants);
  } catch (error) {
    console.error("Error fetching list of Landlords:", error);
    res.status(500).json({ message: "Server error" });
  }
};

async function fetchAllUserRequest(req, res) {
  try {
    const UserRequest = await userListService.getAllUserRequests();

    if (UserRequest.length === 0) {
      return res.json({ message: "No data available" });
    }

    res.json(UserRequest);
  } catch (error) {
    console.error("Error fetching list of User Request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all admin users
const fetchAdmins = async (req, res) => {
  try {
    const admins = await userListService.getAllAdmins();
    
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found", count: 0 });
    }
    
    // Map through the admins and concatenate first_name and last_name
    const adminsWithFullName = admins.map((admin) => {
      const { password_hash, ...adminData } = admin._doc; // Exclude password_hash
      return {
        ...adminData, // Keep other properties of the admin object
        fullName: `${admin.first_name} ${admin.last_name}`, // Concatenate first_name and last_name
      };
    });

    // Include the count of all admins in the response
    res.status(200).json({ count: admins.length, admins: adminsWithFullName });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
};


const addAdminUser = async (req, res) => {
  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new admin user
    const newAdmin = new Admin({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password_hash: hashedPassword,
      phone_num: req.body.phone,
      role: req.body.role,
    });
    await newAdmin.save();

    return res.status(201).json({ message: 'Admin added successfully.' });
  } catch (error) {
    console.error("Error adding admin user:", error);//debugging libagin
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  fetchAdmins, addAdminUser, fetchAllLandlords, fetchAllOccupants, fetchAllUserRequest
};
