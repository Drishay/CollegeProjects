const express = require('express');
const router = express.Router();
const db = require('../db/co'); // We'll create the db connection module in the next step

// Register User
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  
  db.query(query, [username, password, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to register user' });
    }
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
});

// Login User
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found or incorrect credentials' });
    }
    res.status(200).json({ message: 'Login successful', user: results[0] });
  });
});

module.exports = router;
