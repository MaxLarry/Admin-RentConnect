const express = require('express');
const UserProfileRequestController = require('../controllers/userRequestController');
const router = express.Router();

router.get('/user-profile-requests', UserProfileRequestController.getAlluserProfileRequest);

module.exports = router;
