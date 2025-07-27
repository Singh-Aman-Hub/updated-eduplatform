
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Imports the main components for routing
import UserSetup from './components/UserSetup';
import ChatWindow from './components/ChatWindow';
import CombinedChatLayout from './components/CombinedChatLayout'; // The new combined layout

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSetup />} /> {/* Landing page for user setup */}
        
        {/* Both junior and senior roles now use CombinedChatLayout for their main chat view */}
        <Route path="/connections" element={<CombinedChatLayout />} /> 
        <Route path="/senior-dashboard" element={<CombinedChatLayout />} />

        {/* Fallback route for direct chat access (e.g., if a link is shared) */}
        <Route path="/chat/:connectionId" element={<ChatWindow />} /> 

        {/* Catch-all for undefined routes, redirects to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}