// Cleans user input to prevent XSS attacks
// XSS = when someone types malicious code into your form

function sanitizeInput(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .replace(/&/g, '&amp;')   // & → &amp;
    .replace(/</g, '&lt;')    // < → &lt;   (blocks HTML tags)
    .replace(/>/g, '&gt;')    // > → &gt;
    .replace(/"/g, '&quot;')  // " → &quot;
    .slice(0, 2000);           // hard max 2000 characters
}

// This runs on every request before it reaches your route
function sanitizer(req, res, next) {
  if (req.body) {
    req.body.name    = sanitizeInput(req.body.name);
    req.body.email   = sanitizeInput(req.body.email);
    req.body.phone   = sanitizeInput(req.body.phone);
    req.body.message = sanitizeInput(req.body.message);
  }
  next(); // move to next middleware
}

module.exports = sanitizer;