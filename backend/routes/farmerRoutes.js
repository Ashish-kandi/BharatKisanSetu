const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const filePath = path.join(__dirname, '../data/farmers.json');

function getFarmers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function saveFarmers(farmers) {
  fs.writeFileSync(filePath, JSON.stringify(farmers, null, 2));
}

// Register
router.post('/register', (req, res) => {
  const newFarmer = req.body;
  const farmers = getFarmers();

  const exists = farmers.some(f => f.phone === newFarmer.phone);
  if (exists) {
    return res.status(400).json({ message: 'Farmer already exists' });
  }

  farmers.push(newFarmer);
  saveFarmers(farmers);
  res.json({ message: 'Registration successful' });
});

// Login
router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const farmers = getFarmers();

  const farmer = farmers.find(f => f.phone === phone && f.password === password);
  if (farmer) {
    res.json({ message: 'Login successful', farmer });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
