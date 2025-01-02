const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware factory that creates specific middleware based on type
const createAuthMiddleware = (type = 'default') => {
  return (req, res, next) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No authentication token found' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Log decoded token for debugging
      console.log('Decoded token:', decoded);

      // Set user info based on middleware type
      if (type === 'form') {
        req.user = {
          _id: decoded.user.id
        };
        console.log('Setting form req.user to:', req.user);
      } else {
        // For folder operations or default case, use full user object
        req.user = decoded.user;
        console.log('Setting folder req.user to:', req.user);
      }

      next();
    } catch (err) {
      console.error('Auth Middleware Error:', err);
      res.status(401).json({ message: 'Token is invalid', error: err.message });
    }
  };
};

// Create specific middleware instances
const folderAuthMiddleware = createAuthMiddleware('folder');
const formAuthMiddleware = createAuthMiddleware('form');
const defaultAuthMiddleware = createAuthMiddleware();

module.exports = {
  folderAuthMiddleware,
  formAuthMiddleware,
  defaultAuthMiddleware
};