const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },   // can be farmer or consumer
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true }, // can be farmer or consumer
  text: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);
