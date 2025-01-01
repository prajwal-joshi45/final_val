const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token found' });
    }

    // Verify token (make sure to use the same secret key you used to sign the token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log decoded token for debugging
    console.log('Decoded token:', decoded);

    // Set user info on request object
    // Since your token structure has user.id nested
    req.user = decoded.user;

    // Log the user object that's being set
    console.log('Setting req.user to:', req.user);

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(401).json({ message: 'Token is invalid', error: err.message });
  }
};

module.exports = authMiddleware;