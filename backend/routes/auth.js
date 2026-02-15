const express = require('express');
const router = express.Router();

// Simple login - accepts ANY email/password for testing
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', email, password); // Check terminal for this
  
  // Accept any email that contains "@" and any password with 3+ characters
  if (email.includes('@') && password.length >= 3) {
    res.json({
      token: 'test-token-12345',
      user: {
        email: email,
        name: 'Seacco Director',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;