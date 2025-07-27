
import io from 'socket.io-client';

// This line establishes the connection to your backend Socket.IO server.
// Ensure your backend server is running on http://localhost:5001
const socket = io('http://localhost:5001');

export default socket;