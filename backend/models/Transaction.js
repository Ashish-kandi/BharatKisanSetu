const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consumer', required: true },
  crop: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, delivered, cancelled
  paymentStatus: { type: String, default: 'unpaid' }, // unpaid, paid
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
