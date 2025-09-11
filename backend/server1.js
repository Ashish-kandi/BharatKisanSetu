const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = './farmers.json';

// Load existing farmers or start empty
let farmers = fs.existsSync(DATA_PATH)
  ? JSON.parse(fs.readFileSync(DATA_PATH))
  : [];

app.post('/api/register', (req, res) => {
  const { name, phone, username, password } = req.body;

  const exists = farmers.find(f => f.username === username);
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const farmer = { name, phone, username, password };
  farmers.push(farmer);
  fs.writeFileSync(DATA_PATH, JSON.stringify(farmers, null, 2));

  res.json({ message: 'Registered successfully' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const farmer = farmers.find(f => f.username === username && f.password === password);
  if (farmer) {
    res.json({ message: 'Login successful', farmer });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
