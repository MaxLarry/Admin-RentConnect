// userService.js
const Admin = require('../models/Admin'); // Import your User model

// Fetch all admin users
const getAllAdmins = async () => {
  try {
    const adminRoles = ["Super-admin", "Admin", "Listing Manager", "User Manager"];
    const admins = await Admin.find({ role: { $in: adminRoles } }); // Find users with roles in the adminRoles array
    return admins;
  } catch (error) {
    throw new Error('Error fetching admins: ' + error.message);
  }
};

module.exports = {
  getAllAdmins,
};
