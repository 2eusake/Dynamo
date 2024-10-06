// middlewares/rateLimiter.js

const rateLimit = require('express-rate-limit');

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset attempts from this IP, please try again after 15 minutes',
});

module.exports = { resetPasswordLimiter };
