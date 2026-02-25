const rateLimit = require('express-rate-limit');

const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many messages sent from this device. Please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = emailRateLimiter;