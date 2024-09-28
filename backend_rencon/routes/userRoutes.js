const express = require("express");
const {
  fetchAdmins,
  addAdminUser,
  fetchAllLandlords,
  fetchAllOccupants,
  fetchAllUserRequest,
  updateUser,
  updateAdmin,
  deleteUserLandlordWithPropertiesAndRooms,
  deleteUserSelectedLandlordsandCredentials,
  deleteUserSelectedOccupants,
  deleteUserOccupant,
  deleteAdmin,
  deleteSelectedAdmin,
} = require("../controllers/userListController");
const router = express.Router();

//router.get('/user-profile-requests', UserListController.getAlluserProfileRequest);
router.get("/admin", fetchAdmins);
router.post("/admin/add", addAdminUser);

router.get("/landlord", fetchAllLandlords);
router.get("/occupant", fetchAllOccupants);
router.get("/user-request", fetchAllUserRequest);


router.put('/user-edit/:id', updateUser);
router.put('/admin-edit/:id', updateAdmin);

router.delete("/admin-deletion", deleteAdmin);
router.delete("/selected-admin-deletion", deleteSelectedAdmin);

router.delete("/landlord-deletion", deleteUserLandlordWithPropertiesAndRooms);
router.delete("/selected-landlord-deletion", deleteUserSelectedLandlordsandCredentials);

router.delete("/occupant-deletion", deleteUserOccupant);
router.delete("/selected-occupant-deletion", deleteUserSelectedOccupants);


module.exports = router;
