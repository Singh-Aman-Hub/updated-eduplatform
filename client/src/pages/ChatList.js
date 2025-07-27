import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import './ChatList.css';

const ChatList = ({ onChatSelect }) => {
    const [chats, setChats] = useState([]);
    const student = localStorage.getItem('student');

    useEffect(() => {
        const userId = localStorage.getItem('user');
        if (!userId) {
            console.error("❌ No logged-in user found in localStorage");
            return;
        }

        const fetchChats = async () => {
            try {
                const res = await axios.get(`/api/chatslist/${userId}`);
                console.log("✅ Chat list fetched:", res.data);
                setChats(res.data);
            } catch (err) {
                if (err.response?.status === 400) {
                    alert("Your session expired, Kindly login again!");
                    localStorage.removeItem("user");
                    localStorage.removeItem("student");
                    localStorage.removeItem("token");
                    window.location.href = '/login';
                }
                console.error('❌ Error fetching chat list:', err);
            }
        };

        fetchChats();
    }, []);

    const handleChatClick = (contactId, receiverName) => {
        const senderId = localStorage.getItem('user');
        const receiverId = contactId;

        if (onChatSelect) {
            onChatSelect({
                senderId,
                receiverId,
                receiver: receiverName,
            });
        }
    };

    return (
        <div className="chat-list-container">
            <h2 className="chat-list-header">
                Your Chats with {student === 'school' ? 'Seniors' : 'Juniors'}
            </h2>
            {chats.length === 0 ? (
                <p className="no-chats-message">No chats found. Start a conversation!</p>
            ) : (
                <ul className="chat-list">
                    {chats.map((chat, idx) => (
                        <li
                            key={idx}
                            className="chat-list-item"
                            onClick={() => handleChatClick(chat.contactId, chat.name)}
                        >
                            <div className="chat-details">
                                <strong className="chat-name">{chat.name}</strong>
                                <p className="chat-last-message">
                                    msg: {chat.lastMessage || "No messages yet"}
                                </p>
                            </div>
                            <button
                                className="open-chat-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChatClick(chat.contactId, chat.name);
                                }}
                            >
                                Open Chat
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChatList;