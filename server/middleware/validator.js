// Validates that form data is correct before sending email

function isValidEmail(email) {
  // Checks email has proper format like name@domain.com
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  // Phone is optional — only validate if provided
  if (!phone) return true;
  // Allows formats: +91 8881778519, 8881778519, (888) 177-8519
  return /^[+\d\s\-(). ]{7,20}$/.test(phone);
}

function validator(req, res, next) {
  const { name, email, phone, message } = req.body;

  // Check required fields exist
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Name, email and message are required.'
    });
  }

  // Check minimum lengths
  if (name.length < 2) {
    return res.status(400).json({
      error: 'Name must be at least 2 characters.'
    });
  }

  if (message.length < 10) {
    return res.status(400).json({
      error: 'Message must be at least 10 characters.'
    });
  }

  // Check email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Please enter a valid email address.'
    });
  }

  // Check phone format (optional field)
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({
      error: 'Please enter a valid phone number.'
    });
  }

  next(); // all checks passed — move forward
}

module.exports = validator;