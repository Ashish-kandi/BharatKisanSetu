// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const farmerRoutes = require('./routes/farmerRoutes');
const consumerRoutes = require('./routes/consumerRoutes');
const ordersRoute = require('./routes/orders');

const app = express();
const PORT = 5000;

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('✅ Created data directory');
}

// ✅ Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/consumers', consumerRoutes);
app.use('/api/orders', ordersRoute);

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('API is working ✅');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
