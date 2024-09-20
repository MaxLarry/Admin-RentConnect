const express = require('express');
const { fetchAdmins, addAdminUser } = require('../controllers/userListController');
const router = express.Router();

//router.get('/user-profile-requests', UserListController.getAlluserProfileRequest);
router.get('/admin', fetchAdmins);
router.post('/admin/add', addAdminUser)

module.exports = router;
