const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  crops: [{ type: String }], // e.g., ["Tomatoes", "Brinjals"]
  profilePic: { type: String }, // optional URL or base64
  posts: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  contact: {
    phone: String,
    videoLink: String,
    messageLink: String,
  }
});

module.exports = mongoose.model('Farmer', farmerSchema);
