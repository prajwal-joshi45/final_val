const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const createAuthMiddleware = (type = 'default') => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No authentication token found' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
      if (type === 'form') {
        req.user = {
          _id: decoded.user.id
        };
        console.log('Setting form req.user to:', req.user);
      } else {
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
const folderAuthMiddleware = createAuthMiddleware('folder');
const formAuthMiddleware = createAuthMiddleware('form');
const defaultAuthMiddleware = createAuthMiddleware();

module.exports = {
  folderAuthMiddleware,
  formAuthMiddleware,
  defaultAuthMiddleware
};