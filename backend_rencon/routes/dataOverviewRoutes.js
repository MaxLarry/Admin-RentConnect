const express = require("express");
const { getAllUserCount, userRegCount } = require("../controllers/DataOverviewController");
const router = express.Router();


router.get("/user-count", getAllUserCount);
router.get("/user-register-count", userRegCount);

module.exports = router;
