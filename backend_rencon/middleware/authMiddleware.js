const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (!req.cookies.token) {
    return res.status(401).json({ message: "Token not found in cookies" });
  }
  
  if (req.cookies && req.cookies.token) {
    console.log('ito Cookies:', req.cookies); 
    try {
      token = req.cookies.token;

      console.log('Token:', token); // Log the token for debugging

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Decoded:', decoded); // Log the decoded payload for debugging

      // Find the user by ID and exclude the password hash
      req.user = await Admin.findById(decoded.id).select('-password_hash');

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('Authenticated User:', req.user); // Log the authenticated user

      next();
    } catch (error) {
      console.error('Token verification failed:', error); // Log the error for debugging
      return res.status(401).json({ isAuthenticated: false, message: 'Not authorized, token failed' });
    }
  } else {
    console.log('Request Cookies:', req.cookies); // Log cookies
    return res.status(401).json({ isAuthenticated: false, message: 'Not authorized, no token' });
  }
};


module.exports = { protect };
