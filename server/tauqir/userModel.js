
// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // CRITICAL FIX: Removed explicit _id definition. Mongoose will auto-generate ObjectId _id.
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String, // 'junior' or 'senior'
    required: true,
    enum: ['junior', 'senior'], // Restrict roles
  },
  // CRITICAL FIX: Removed explicit createdAt. timestamps: true handles this.
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  collection: 'users' // Explicitly sets collection name to 'users' (plural)
});

const User = mongoose.model('User', userSchema);

module.exports = User;