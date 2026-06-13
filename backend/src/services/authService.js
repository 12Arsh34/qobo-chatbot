import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate JWT token with 7-day expiry
 * @param {string} id - User ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * Register a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Object} { token, user }
 */
export const registerUser = async (name, email, password) => {
  // Validate fields
  if (!name || !email || !password) {
    const error = new Error('Please provide all fields: name, email, password');
    error.statusCode = 400;
    throw error;
  }

  // Check for existing email
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  // Create user (password hashing handled by User model pre-save hook)
  const user = await User.create({ name, email, password });

  if (!user) {
    const error = new Error('Invalid user data');
    error.statusCode = 400;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  };
};

/**
 * Authenticate existing user
 * @param {string} email
 * @param {string} password
 * @returns {Object} { token, user }
 */
export const loginUser = async (email, password) => {
  // Validate fields
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    throw error;
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  };
};
