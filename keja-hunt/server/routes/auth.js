const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Register new user
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, user_type, first_name, last_name, phone_number } = req.body;

    // Check if user exists
    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await query(
      'INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [email, hashedPassword, user_type, first_name, last_name, phone_number]
    );

    // Create and send JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id, user_type: newUser.rows[0].user_type },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        user_type: newUser.rows[0].user_type,
        first_name: newUser.rows[0].first_name,
        last_name: newUser.rows[0].last_name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send JWT
    const token = jwt.sign(
      { id: user.rows[0].id, user_type: user.rows[0].user_type },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        user_type: user.rows[0].user_type,
        first_name: user.rows[0].first_name,
        last_name: user.rows[0].last_name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;