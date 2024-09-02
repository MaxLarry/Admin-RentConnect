const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Adjusted to match your Admin model

const protect = async (req, res, next) => {
  let token;

  // Check if the token is present in cookies
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and exclude the password hash
      req.user = await Admin.findById(decoded.id).select('-password_hash');

      // Proceed to the next middleware/route handler
      next();
    } catch (error) {
      // Handle token verification failure
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // Handle missing token case
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
