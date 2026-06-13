import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 attempts per 15 mins for signup/login
  message: {
    message: 'Too many login or registration attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150, // Max 150 requests per 15 mins for chat and history actions
  message: {
    message: 'Too many API requests from this connection. Please wait 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
