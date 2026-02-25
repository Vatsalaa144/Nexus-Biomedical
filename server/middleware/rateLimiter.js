const rateLimit = require('express-rate-limit');

// Allows max 5 form submissions per IP per hour
const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5,                    // max 5 requests per IP
  message: {
    error: 'Too many messages sent from this device. Please try again after 1 hour.'
  },
  standardHeaders: true,     // sends rate limit info in response headers
  legacyHeaders: false,      // disables old X-RateLimit headers
});

module.exports = emailRateLimiter;