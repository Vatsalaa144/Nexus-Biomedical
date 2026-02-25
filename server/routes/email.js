const express        = require('express');
const router         = express.Router();
const emailRateLimiter = require('../middleware/rateLimiter');
const sanitizer      = require('../middleware/sanitizer');
const validator      = require('../middleware/validator');
const { sendEnquiryEmail } = require('../services/mailService');

// POST /api/contact
// Flow: rateLimiter → sanitizer → validator → send email
router.post(
  '/contact',
  emailRateLimiter,  // Step 1: block if too many requests
  sanitizer,         // Step 2: clean the input
  validator,         // Step 3: validate the input
  async (req, res) => {

    const { name, email, phone, message, honeypot } = req.body;

    // ── Honeypot check ──
    // This field is hidden in the form
    // Real users never fill it — bots always do
    if (honeypot) {
      // Silently succeed — don't let bots know they were blocked
      return res.status(200).json({ success: true });
    }

    // ── Send the email ──
    try {
      await sendEnquiryEmail({ name, email, phone, message });

      return res.status(200).json({
        success: true,
        message: 'Message sent successfully!'
      });

    } catch (err) {
      console.error('Email sending error:', err);

      return res.status(500).json({
        error: 'Failed to send message. Please try again or contact us directly.'
      });
    }
  }
);

module.exports = router;