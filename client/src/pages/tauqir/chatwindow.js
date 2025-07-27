
// src/components/ChatWindow.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import socket from '../socket';
import api from './axiosConfig'; // CRITICAL CHANGE: Import the configured axios instance

// Import child components from their separate files
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';


// ChatWindow now always expects connectionId and selectedSeniorName (or junior name) as props
const ChatWindow = ({ connectionId, selectedSeniorName }) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  
  const senderId = localStorage.getItem('userId');

  useEffect(() => {
    console.log("--- ChatWindow Component Mount/Update Cycle ---");
    console.log("Current logged-in senderId from localStorage (on render):", senderId);
    console.log("ConnectionId from props (on render):", connectionId);

    if (!senderId) {
      console.warn("ChatWindow: No senderId found in localStorage. This should be handled by parent route.");
    }
  }, [senderId, connectionId]);

  useEffect(() => {
    // Only fetch history if a connectionId is provided
    if (!connectionId) {
      console.log("ChatWindow History: No connectionId, skipping history fetch.");
      setMessages([]); // Clear messages if connectionId becomes null
      return;
    }

    console.log(`ChatWindow History: Fetching chat history for connectionId: ${connectionId}`);
    const fetchHistory = async () => {
      try {
        // CRITICAL CHANGE: Use api.get instead of axios.get
        const res = await api.get(`/api/chats/${connectionId}/history`);
        
        setMessages(res.data.messages.map(msg => ({ ...msg, messageId: msg._id })));
        console.log("ChatWindow History: Chat history loaded:", res.data.messages);
      } catch (error) {
        console.error('ChatWindow History Error:', error);
      }
    };

    fetchHistory();

    // Socket setup and cleanup for the current connectionId
    console.log(`ChatWindow Socket Setup: Attempting to join chat room: ${connectionId} with senderId: ${senderId}`);
    if (socket.connected) {
      socket.emit('joinChat', connectionId);
      console.log(`ChatWindow Socket Setup: Emitted 'joinChat' for room ${connectionId}.`);
    } else {
      console.warn("ChatWindow Socket Setup: Socket not connected yet, will emit 'joinChat' on connect.");
      const connectHandler = () => {
        socket.emit('joinChat', connectionId);
        console.log(`ChatWindow Socket Setup: Socket connected, emitted 'joinChat' for room ${connectionId}.`);
        socket.off('connect', connectHandler);
      };
      socket.on('connect', connectHandler);
    }

    const onConnect = () => {
      console.log('ChatWindow Socket: Socket.IO Connected! Socket ID:', socket.id);
      console.log('ChatWindow Socket: Socket.IO Transport:', socket.io.engine.transport.name);
    };
    const onDisconnect = (reason) => {
      console.log('ChatWindow Socket: Socket.IO Disconnected. Reason:', reason);
    };
    const onConnectError = (error) => {
      console.error('ChatWindow Socket: Socket.IO Connection Error:', error);
      if (error.message) console.error("Error message:", error.message);
      if (error.description) console.error("Error description:", error.description);
      if (error.context) console.error("Error context:", error.context);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    const handleReceiveMessage = (data) => {
      console.log('ChatWindow Socket Event: Received new message:', data);
      if (data.connectionId === connectionId) {
        setMessages((prev) => {
          const existingIndex = prev.findIndex(msg => msg.tempId === data.tempId);
          if (existingIndex > -1) {
            const newMessages = [...prev];
            newMessages[existingIndex] = { ...data, messageId: data._id || data.messageId };
            console.log('ChatWindow Socket Event: Optimistic message confirmed and updated.');
            return newMessages;
          } else {
            console.log('ChatWindow Socket Event: Adding new message.');
            return [...prev, { ...data, messageId: data._id || data.messageId }];
          }
        });
      } else {
        console.warn(`ChatWindow Socket Event: Received message for different connectionId. Expected: ${connectionId}, Got: ${data.connectionId}`);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      console.log(`ChatWindow Socket Cleanup: Cleaning up socket listeners for ${connectionId}`);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('receiveMessage', handleReceiveMessage);
      // When connectionId changes, leave the previous room
      if (connectionId) {
        socket.emit('leaveChat', connectionId); // Assuming you add a 'leaveChat' handler on backend
        console.log(`ChatWindow Socket Cleanup: Emitted 'leaveChat' for room ${connectionId}.`);
      }
    };
  }, [connectionId, senderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log('ChatWindow UI Update: Scrolled to bottom.');
  }, [messages]);

  const sendMessage = useCallback(() => {
    const trimmed = messageText.trim();
    if (!trimmed || !connectionId || !senderId) {
      console.warn("ChatWindow Send Message: Cannot send message: Missing text, connectionId, or senderId.");
      return;
    }

    const tempId = Date.now() + Math.random();

    const optimisticMessage = {
      tempId: tempId,
      messageId: `temp-${tempId}`,
      connectionId,
      senderId,
      text: trimmed,
      timestamp: new Date().toISOString(),
      edited: false,
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageText('');

    console.log('ChatWindow Send Message: Emitting sendMessage event to server (optimistic update applied):', { connectionId, senderId, text: trimmed, tempId });
    socket.emit('sendMessage', {
      connectionId,
      senderId,
      text: trimmed,
      tempId: tempId
    });

  }, [messageText, connectionId, senderId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full border border-gray-300 rounded-lg shadow-lg bg-gray-50 font-inter">
      <div className="p-4 bg-blue-600 text-white text-center rounded-t-lg shadow-md relative">
        <h2 className="text-xl font-bold">Chat with {selectedSeniorName || 'User'}</h2>
        <p className="text-sm">Connection ID: {connectionId}</p>
        <p className="text-sm">Your ID: {senderId}</p>
      </div>

      <div 
        className="flex-grow p-4 overflow-y-auto flex flex-col bg-gray-100"
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-5">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((msg) => {
          const isSender = msg.senderId === senderId;

          return (
            <React.Fragment key={msg.messageId}>
              <MessageBubble
                message={msg}
                isSender={isSender}
              />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onSend={sendMessage}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ChatWindow;