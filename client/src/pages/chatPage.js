import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './ChatPage.css';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null); // { senderId, receiverId, receiverName }
  const [refreshChats, setRefreshChats] = useState(false); // 👈 Used to refresh ChatList

  // Load chat data from localStorage (e.g. from BrowseSenior or another component)
  useEffect(() => {
    const senderId = localStorage.getItem('chat_senderId');
    const receiverId = localStorage.getItem('chat_receiverId');
    const receiver = localStorage.getItem('chat_receiverName');

    if (senderId && receiverId && receiver) {
      setSelectedChat({ senderId, receiverId, receiver });

      // Optional: clean up after reading
      localStorage.removeItem('chat_senderId');
      localStorage.removeItem('chat_receiverId');
      localStorage.removeItem('chat_receiverName');
    }
  }, []);

  // Handle selecting a chat from ChatList
  const handleChatSelect = (chatData) => {
    setSelectedChat(chatData);
  };

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  return (
    <div className="chat-page-container">
      {(!isMobile || !selectedChat) && (
        <div className="left-panel">
          <ChatList
            onChatSelect={handleChatSelect}
            refreshChats={refreshChats}
          />
        </div>
      )}

      {(!isMobile || selectedChat) && (
        <div className="right-panel">
          {selectedChat ? (
            <ChatWindow
              senderId={selectedChat.senderId}
              receiverId={selectedChat.receiverId}
              receiver={selectedChat.receiver}
              onBack={() => setSelectedChat(null)}
              triggerRefresh={() => setRefreshChats((prev) => !prev)}
            />
          ) : (
            <div className="no-chat-selected">Select a chat to start messaging</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;