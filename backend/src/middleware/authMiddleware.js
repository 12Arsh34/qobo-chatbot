import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes by verifying JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the DB and attach to request object
      // We exclude the password field for security
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error('JWT Verification Failed:', error.message);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  // If no token was found in the header
  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};
