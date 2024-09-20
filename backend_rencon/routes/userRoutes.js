const express = require('express');
const UserListController = require('../controllers/userListController')
const router = express.Router();

//router.get('/user-profile-requests', UserListController.getAlluserProfileRequest);
router.get('/admins', UserListController.fetchAdmins);

module.exports = router;
