import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './ChatPage.css';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null); // { senderId, receiverId, receiverName }
  const [refreshChats, setRefreshChats] = useState(false); // 👈 Used to refresh ChatList
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Handle back navigation on mobile
  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="chat-page-container">
      {/* Desktop: Show both panels side by side */}
      {!isMobile && (
        <>
          <div className="left-panel">
            <ChatList
              onChatSelect={handleChatSelect}
              refreshChats={refreshChats}
            />
          </div>
          <div className="right-panel">
            {selectedChat ? (
              <ChatWindow
                senderId={selectedChat.senderId}
                receiverId={selectedChat.receiverId}
                receiver={selectedChat.receiver}
                onBack={handleBack}
                triggerRefresh={() => setRefreshChats((prev) => !prev)}
              />
            ) : (
              <div className="no-chat-selected">Select a chat to start messaging</div>
            )}
          </div>
        </>
      )}

      {/* Mobile: Show either chat list or chat window */}
      {isMobile && (
        <>
          {!selectedChat ? (
            <div className="mobile-chat-list">
              <ChatList
                onChatSelect={handleChatSelect}
                refreshChats={refreshChats}
              />
            </div>
          ) : (
            <div className="mobile-chat-window">
              <ChatWindow
                senderId={selectedChat.senderId}
                receiverId={selectedChat.receiverId}
                receiver={selectedChat.receiver}
                onBack={handleBack}
                triggerRefresh={() => setRefreshChats((prev) => !prev)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatPage;