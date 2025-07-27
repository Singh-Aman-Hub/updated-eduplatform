
// src/components/CombinedChatLayout.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './axiosConfig'; // CRITICAL CHANGE: Import the configured axios instance
import ChatWindow from './chatwindow';

const CombinedChatLayout = () => {
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState('');
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('user');
  const role = localStorage.getItem('student');

  useEffect(() => {
    if (!userId || !role) {
      console.warn("CombinedChatLayout: User ID or Role not set. Redirecting to setup.");
      navigate('/');
      return;
    }
  }, [userId, role, navigate]);

  useEffect(() => {
    if (!userId) {
      setError('User ID is not set. Cannot fetch conversations.');
      return;
    }

    const fetchConversations = async () => {
      try {
        // CRITICAL CHANGE: Use api.get instead of axios.get
        const res = await api.get(`/api/chats/user-conversations/${userId}`);
        setConversations(res.data);
        console.log("CombinedChatLayout: Fetched conversations:", res.data);
      } catch (err) {
        console.error('Error fetching user conversations:', err);
        setError(err.response?.data?.message || 'Something went wrong while fetching conversations');
      }
    };

    fetchConversations();
  }, [userId]);

  const handleSelectConnection = useCallback((connectionId, partnerName) => {
    setSelectedConnectionId(connectionId);
    setSelectedPartnerName(partnerName);
    console.log(`CombinedChatLayout: Selected connection: ${connectionId} with ${partnerName}`);
  }, []);

  const formatLastActivity = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
  };

  if (!userId || !role) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 font-inter">
      {/* Left Pane: Conversation List */}
      <div className="w-1/3 border-r border-gray-300 bg-white shadow-lg flex flex-col">
        <div className="p-4 bg-blue-600 text-white text-center shadow-md">
          <h2 className="text-xl font-bold">
            {role === 'junior' ? 'Your Seniors' : 'Your Juniors'}
          </h2>
          <p className="text-sm">Your ID: {userId}</p>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {conversations.length === 0 ? (
            <p className="text-center text-gray-600">
              {role === 'junior' 
                ? 'No active conversations yet. Send a message to a senior to start one!'
                : 'No active conversations yet. Juniors need to send you a message first!'
              }
            </p>
          ) : (
            <ul className="list-none p-0">
              {conversations.map((conv) => (
                <li
                  key={conv.connectionId}
                  onClick={() => handleSelectConnection(conv.connectionId, conv.otherParticipantName)}
                  className="p-4 mb-3 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm"
                >
                  <strong className="text-lg text-gray-900">Chat with {conv.otherParticipantName}</strong> <br />
                  <small className="text-gray-600">Last activity: {formatLastActivity(conv.lastActivity)}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:underline transition duration-200 ease-in-out"
          >
            &larr; Back to User Setup
          </Link>
        </div>
      </div>

      {/* Right Pane: Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedConnectionId ? (
          <ChatWindow connectionId={selectedConnectionId} selectedSeniorName={selectedPartnerName} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-600 text-lg">
            <p>Select a {role === 'junior' ? 'senior' : 'junior'} from the left to start chatting.</p>
            <p className="mt-2 text-sm">Your User ID: {userId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedChatLayout;