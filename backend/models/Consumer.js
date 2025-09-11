const mongoose = require('mongoose');

const consumerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orders: [
    {
      crop: { type: String },
      quantity: { type: Number },
      deliveryTime: { type: String }, // e.g., "2 days"
      status: { type: String, default: "pending" },
    }
  ]
});

module.exports = mongoose.model('Consumer', consumerSchema);
