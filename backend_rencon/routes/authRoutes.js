const express = require("express");
const {  loginUser, } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", loginUser);

router.get("/checkAuth", protect, (req, res) => {
  res.status(200).json({message: "Login Sucessfully", isAuthenticated: true, user: req.user });
});

/*
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      
  res.status(200).json({ message: "Logged out successfully" });
});*/

module.exports = router;
