const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/checkAuth", protect, (req, res) => {
  res.status(200).json({message: "Login Sucessfully"  , isAuthenticated: true, user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,//process.env.NODE_ENV === "production"
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
