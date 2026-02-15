const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Hardcoded admin user (for now)
const ADMIN_USER = {
  email: 'director@Sseacco', // or whatever email you want
  password: 'admin123', // we'll use plain text for now
  name: 'Seacco Director',
  role: 'admin'
};

// Simple login without database
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Check email
  if (email !== ADMIN_USER.email) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Check password (plain text for now - you should hash this!)
  if (password !== 'admin123') { // Change this to your desired password
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { email: ADMIN_USER.email, role: ADMIN_USER.role },
    'your-jwt-secret-key',
    { expiresIn: '7d' }
  );
  
  res.json({
    token,
    user: {
      email: ADMIN_USER.email,
      name: ADMIN_USER.name,
      role: ADMIN_USER.role
    }
  });
});

module.exports = router;