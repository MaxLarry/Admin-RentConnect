const express = require('express');
const { fetchAdmins, addAdminUser, fetchAllLandlords, fetchAllOccupants, fetchAllUserRequest } = require('../controllers/userListController');
const router = express.Router();

//router.get('/user-profile-requests', UserListController.getAlluserProfileRequest);
router.get('/admin', fetchAdmins);
router.post('/admin/add', addAdminUser);

router.get('/landlord', fetchAllLandlords);
router.get('/occupant', fetchAllOccupants);
router.get('/user-request', fetchAllUserRequest);

module.exports = router;
