const express= require('express')
const router= express.Router();
const Chat = require('../models/Chat');
const authMiddleware = require('../auth')
const mongoose= require('mongoose');



router.post('/chats/seed', async (req, res) => {
    try {
        const { juniorId, seniorId } = req.body;

        let chat = await Chat.findOne({ participants: { $all: [juniorId, seniorId] } });

        if (!chat) {
            chat = new Chat({
                participants: [juniorId, seniorId],
                messages: [
                    {
                        senderId: juniorId,
                        text: "Hello Senior! I'm a new junior here.",
                        timestamp: new Date()
                    },
                    {
                        senderId: seniorId,
                        text: "Hey Junior! Welcome to the community.",
                        timestamp: new Date()
                    }
                ]
            });
            await chat.save();
            return res.status(201).json({ msg: 'Dummy chat created', chat });
        }

        res.status(200).json({ msg: 'Chat already exists', chat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to seed chat' });
    }
});

router.get('/chats/:senderId/:receiverId',authMiddleware, async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('participants', 'name email');

        if (!chat) {
            return res.status(200).json([]); // Return empty array if no chat yet
        }

        res.status(200).json(chat.messages);
    } catch (err) {
        console.error('Error fetching chat history:', err);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

router.get('/chatslist/:userId', authMiddleware,async (req, res) => {
    const { userId } = req.params;
    // console.log("✅ API HIT: userId =", userId);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("❌ Invalid userId:", userId);
        return res.status(400).json({ error: 'Invalid userId' });
    }

    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        // console.log("✅ Converted userId to ObjectId:", objectId);

        const chats = await Chat.find({ participants: objectId })
            .populate('participants', 'name email')
            .sort({ updatedAt: -1 });

        // console.log("✅ Chats fetched:", chats);

        const contacts = chats.map(chat => {
            const otherUser = chat.participants.find(
                p => p && p._id.toString() !== userId
            );
            if (!otherUser) return null; // Skip if no other user
            console.log(chat.updatedAt);
            return {
                contactId: otherUser._id,
                name: otherUser.name,
                email: otherUser.email,
                lastMessage: chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].text
                    : '',
                time:chat.updatedAt
                
            };
        }).filter(Boolean);

        res.status(200).json(contacts);
    } catch (err) {
        console.error('❌ Error fetching chat list:', err);
        res.status(500).json({ error: 'Failed to fetch chat list' });
    }
});


module.exports= router