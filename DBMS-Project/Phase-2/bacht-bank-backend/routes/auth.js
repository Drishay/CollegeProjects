const express = require("express");
const router = express.Router();
const db = require("../db/db");

// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide both username and password" });
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: results[0]
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

module.exports = router;
