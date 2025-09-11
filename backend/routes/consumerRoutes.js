const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/consumers.json');

// Helper: Read consumers from file
function getConsumers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Helper: Save consumers to file
function saveConsumers(consumers) {
  fs.writeFileSync(filePath, JSON.stringify(consumers, null, 2));
}

// ✅ Register a new consumer
router.post('/register', (req, res) => {
  const newConsumer = req.body;
  const consumers = getConsumers();

  const exists = consumers.some(c => c.email === newConsumer.email);
  if (exists) {
    return res.status(400).json({ message: 'Consumer already registered' });
  }

  consumers.push(newConsumer);
  saveConsumers(consumers);
  res.json({ message: 'Registration successful' });
});

// ✅ Login an existing consumer
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const consumers = getConsumers();

  const consumer = consumers.find(c => c.email === email && c.password === password);
  if (consumer) {
    res.json({ message: 'Login successful', consumer });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
