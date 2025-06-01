const mysql = require('mysql2');
require('dotenv').config(); // Make sure to load environment variables

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Replace with your MySQL username
  password: '#DRI@7527',        // Replace with your MySQL password
  database: 'bacht_bank_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;

db.query('SELECT 1', (err, results) => {
  if (err) {
    console.log('Query Test Failed:', err);
  } else {
    console.log('Query Test Passed:', results);
  }
});

