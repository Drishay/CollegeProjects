const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing (optional)
const db = require('./db/db'); // Import the db connection from the db.js file
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Login route
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body; // We now also get the role

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  // Query the users table for the username
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = results[0];

    // Validate that the user's role matches the requested role
    if (user.role !== role) {
      return res.status(401).json({ message: `You cannot login as a ${role}. Invalid role for this login type.` });
    }

    // If passwords are hashed, use bcrypt to compare them
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Password comparison error" });
      }

      if (!result) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // If login is successful, send user data and role
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.username, // You can extend this to fetch customer/employee details if needed
        },
        token: "someJWTTokenHere", // Optional if you're using JWTs for session handling
      });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
