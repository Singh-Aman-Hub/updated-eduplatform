const express= require('express')
const User = require('./models/user')
const mongoose= require('mongoose')
const authMiddleware= require('./auth')
const cors= require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const {Server}= require('socket.io')
const Chat = require('./models/Chat');
const bodyParser= require('body-parser')
require('dotenv').config();

// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);



const PORT=process.env.PORT
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000","https://01wt8cb9-3000.inc1.devtunnels.ms"], // Frontend URL
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'], // Allow fallback to polling
    allowEIO3: true
});
app.use(cors({
  origin: ['http://localhost:3000',"https://01wt8cb9-3000.inc1.devtunnels.ms"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())
app.use(bodyParser.json());

const JWT_SECRET= process.env.JWT_SECRET;
// should not be undefined


const db_connection= process.env.DB_URL_online;
// mongoose.connect('mongodb+srv://Aman102006:12344321@cluster0.si4zhhg.mongodb.net/?retryWrites=true&w=majority')
// mongoose.connect('mongodb://127.0.0.1:27017/EduBridgeUsers')
    mongoose.connect(db_connection)
    .then(()=>{
        console.log("Connected to Mongo DB- Collection EduBridgeUsers")
    })
    .catch((err)=>{
        console.log("Error Coonecting to Mongo DB "+err)
    })

const userRoutes= require('./Routes/userRoutes');
const chatRoutes= require('./Routes/chatRoutes');


app.use('/',userRoutes);
app.use('/api',chatRoutes);



io.on('connection', (socket) => {
    console.log(`✅ Socket.IO: User connected [socket.id=${socket.id}]`);

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`📡 User joined room: ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, senderId, receiverId, text }) => {
        console.log(`💬 Message from ${senderId} to ${receiverId}: ${text}`);

        let chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });
        if (!chat) {
            chat = new Chat({ participants: [senderId, receiverId], messages: [] });
        }

        const newMessage = { senderId, text, timestamp: new Date() };
        chat.messages.push(newMessage);
        await chat.save();
        console.log(`📡 Broadcasting to room: ${roomId} with ${JSON.stringify(newMessage)}`);
        // ✅ Emit to all sockets in the room INCLUDING sender
        io.to(roomId).emit('receiveMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Socket.IO: User disconnected [socket.id=${socket.id}]`);
    });
});




// app.listen(PORT,()=>{
//     console.log(`The server is running on port - ${PORT}`)
// })

//chnages to render the client and server together


// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "../client/build")));

// app.use((req, res, next) => {
//   console.log(`Incoming request to ${req.url}`);
//   next();
// });


// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/build/index.html"));
//   });
// }


server.listen(PORT, () => {
  console.log(`The server is running on port - ${PORT}`)
    console.log(`Server running on http://localhost:${PORT}`);
});