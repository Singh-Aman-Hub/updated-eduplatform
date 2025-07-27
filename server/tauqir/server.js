
// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User'); // User model (now points to 'users' collection)
const Chat = require('./models/Chat'); // Chat model (points to 'chats' collection by default)

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow connections from your React app
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// MongoDB Connection
// CRITICAL: Connects to 'bridge_chat' database
mongoose.connect('mongodb://localhost:27017/bridge_chat')
  .then(() => console.log('MongoDB connected to bridge_chat database'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Endpoints ---

// @route   POST /api/users/get-or-create-by-name-and-role
// @desc    Finds a user by name and role, or creates a new one if not found.
// @access  Public (no authentication needed for this simplified setup)
app.post('/api/users/get-or-create-by-name-and-role', async (req, res) => {
    const { name, role } = req.body;
    if (!name || !role) {
        return res.status(400).json({ message: 'Name and role are required.' });
    }

    try {
        // This query will now correctly look in the 'users' collection within 'bridge_chat'
        let user = await User.findOne({ name, role });

        if (user) {
            // User exists, return existing user data
            console.log(`User ${name} (${role}) found with ID: ${user._id}`);
            return res.status(200).json(user);
        } else {
            // User does not exist, create a new one
            // Generate a dummy email for the new user based on name and timestamp
            const dummyEmail = `${name.toLowerCase().replace(/\s/g, '')}-${Date.now()}@example.com`;
            user = new User({ name, email: dummyEmail, role });
            await user.save();
            console.log(`New user ${name} (${role}) created with ID: ${user._id}`);
            return res.status(201).json(user);
        }
    } catch (error) {
        console.error('Error during user get-or-create:', error);
        // Handle potential duplicate email errors if an email is somehow reused
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }
        res.status(500).json({ message: 'Server error during user operation.' });
    }
});

// @route   GET /api/users/opposite-role
// @desc    Get users with the opposite role who are NOT already in a chat with the current user
// @access  Public
app.get('/api/users/opposite-role', async (req, res) => {
  const { userId, role } = req.query; // userId is the ID of the current user
  if (!userId || !role) {
    return res.status(400).json({ message: 'User ID and role are required query parameters.' });
  }

  const oppositeRole = role === 'junior' ? 'senior' : 'junior';

  try {
    // This query will also correctly look in the 'users' collection
    const oppositeUsers = await User.find({ role: oppositeRole }).select('name email role');

    // Find all chats involving the current user
    const existingChats = await Chat.find({ participants: userId }).select('participants');
    const chattedUserIds = new Set();
    existingChats.forEach(chat => {
      chat.participants.forEach(pId => {
        if (pId.toString() !== userId) { // Add the other participant's ID
          chattedUserIds.add(pId.toString());
        }
      });
    });

    // Filter out users who are already in a chat with the current user
    const filteredUsers = oppositeUsers.filter(user => !chattedUserIds.has(user._id.toString()));

    res.json(filteredUsers);
  } catch (error) {
    console.error('Error fetching opposite role users:', error);
    res.status(500).json({ message: 'Server error fetching opposite role users.' });
  }
});

// @route   GET /api/chats/user-conversations/:userId
// @desc    Get all conversations for a specific user
// @access  Public
app.get('/api/chats/user-conversations/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Chat.find({ participants: userId })
      .populate('participants', 'name role') // Populate name and role of participants
      .lean(); // Use .lean() for faster query

    const formattedConversations = conversations.map(chat => {
      // Find the other participant in the chat
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);
      return {
        connectionId: chat._id, // The chat's own ID
        otherParticipantId: otherParticipant ? otherParticipant._id.toString() : 'Unknown',
        otherParticipantName: otherParticipant ? otherParticipant.name : 'Unknown',
        lastActivity: chat.lastActivity,
        messages: chat.messages // Include messages for history display
      };
    });
    res.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    res.status(500).json({ message: 'Server error fetching conversations.' });
  }
});

// @route   POST /api/chats/get-or-create
// @desc    Finds an existing chat between two users, or creates a new one.
// @access  Public
app.post('/api/chats/get-or-create', async (req, res) => {
  const { juniorId, seniorId } = req.body;

  if (!juniorId || !seniorId) {
    return res.status(400).json({ message: 'Both juniorId and seniorId are required.' });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [juniorId, seniorId] }
    });

    if (chat) {
      return res.status(200).json({ message: 'Existing chat found.', connectionId: chat._id });
    } else {
      // Create new chat
      chat = new Chat({
        participants: [juniorId, seniorId],
        messages: []
      });
      await chat.save();
      return res.status(201).json({ message: 'New chat created.', connectionId: chat._id });
    }
  } catch (error) {
    console.error('Error getting or creating chat:', error);
    res.status(500).json({ message: 'Server error getting or creating chat.' });
  }
});

// @route   GET /api/chats/:connectionId/history
// @desc    Get message history for a specific chat
// @access  Public
app.get('/api/chats/:connectionId/history', async (req, res) => {
  const { connectionId } = req.params;
  try {
    const chat = await Chat.findById(connectionId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    res.json({ messages: chat.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error fetching chat history.' });
  }
});


// --- Socket.IO Handlers ---

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinChat', (connectionId) => {
    socket.join(connectionId); // Joins the socket to a specific chat room
    console.log(`Socket ${socket.id} joined room ${connectionId}`);
  });

  socket.on('leaveChat', (connectionId) => {
    socket.leave(connectionId); // Leaves the chat room
    console.log(`Socket ${socket.id} left room ${connectionId}`);
  });

  socket.on('sendMessage', async (data) => {
    const { connectionId, senderId, text, tempId } = data;
    try {
      const chat = await Chat.findById(connectionId);
      if (chat) {
        const newMessage = { senderId, text };
        chat.messages.push(newMessage);
        chat.lastActivity = new Date(); // Update last activity timestamp
        await chat.save();
        
        // Emit the message to all clients in the room, including the actual _id from MongoDB
        io.to(connectionId).emit('receiveMessage', {
          ...newMessage,
          _id: newMessage._id.toString(), // Convert ObjectId to string for frontend
          connectionId,
          tempId, // Original temporary ID for optimistic update
          timestamp: chat.lastActivity.toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving or emitting message:', error);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));