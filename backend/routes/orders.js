// backend/routes/orders.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ordersFilePath = path.join(__dirname, '../data/orders.json');

// ✅ Ensure orders.json exists
if (!fs.existsSync(ordersFilePath)) {
  fs.writeFileSync(ordersFilePath, '[]', 'utf8');
  console.log('✅ Created orders.json file');
}

router.post('/', (req, res) => {
  const newOrder = req.body;

  fs.readFile(ordersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading orders.json:', err);
      return res.status(500).json({ message: 'Failed to read orders file' });
    }

    let orders = [];
    try {
      orders = data ? JSON.parse(data) : [];
    } catch (parseErr) {
      console.error('❌ Error parsing orders.json:', parseErr);
      return res.status(500).json({ message: 'Invalid orders file format' });
    }

    orders.push(newOrder);

    fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
      if (err) {
        console.error('❌ Error writing orders.json:', err);
        return res.status(500).json({ message: 'Failed to save order' });
      }

      console.log('✅ Order saved:', newOrder);
      res.status(201).json({ message: 'Order saved successfully' });
    });
  });
});

module.exports = router;
