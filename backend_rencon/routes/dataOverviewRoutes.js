const express = require("express");
const { getAllUserCount, userRegCount,userActiveCount } = require("../controllers/DataOverviewController");
const router = express.Router();


router.get("/user-count", getAllUserCount);
router.get("/user-register-count", userRegCount);
router.get("/user-active-count", userActiveCount);

module.exports = router;
