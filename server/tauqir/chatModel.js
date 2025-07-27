
// server/models/Chat.js
const mongoose = require('mongoose');

// Schema for individual chat messages
const messageSchema = new mongoose.Schema({
  // CRITICAL FIX: Changed senderId to ObjectId reference
  senderId: {
    type: mongoose.Schema.Types.ObjectId, // Now an ObjectId
    ref: 'User', // References the 'User' model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  // CRITICAL FIX: Removed tempId. It's a frontend-only concept.
});

// Main Chat Schema
const chatSchema = new mongoose.Schema({
  // CRITICAL FIX: Removed explicit _id definition. Mongoose will auto-generate ObjectId _id (connectionId).
  participants: {
    type: [mongoose.Schema.Types.ObjectId], // CRITICAL FIX: Array of ObjectIds
    ref: 'User', // References the 'User' model
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length === 2; // Ensure exactly two participants
      },
      message: 'A chat must have exactly two participants.'
    }
  },
  messages: [messageSchema], // Array of messages in this chat
  // CRITICAL FIX: Removed explicit createdAt and updatedAt. timestamps: true handles this.
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;