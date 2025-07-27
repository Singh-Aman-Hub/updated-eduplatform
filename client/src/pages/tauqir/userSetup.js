
// src/components/UserSetup.js
import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';

const UserSetup = () => {
  const [inputUserId, setInputUserId] = useState('');
  const [inputRole, setInputRole] = useState('junior');
  const [currentStoredUserId, setCurrentStoredUserId] = useState('');
  const [currentStoredRole, setCurrentStoredRole] = useState('');
  const [message, setMessage] = useState(''); // New state for messages
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || '';
    const storedRole = localStorage.getItem('role') || 'junior';
    
    setInputUserId(storedUserId);
    setInputRole(storedRole);
    setCurrentStoredUserId(storedUserId);
    setCurrentStoredRole(storedRole);

    console.log("UserSetup: Component mounted.");
    console.log("UserSetup: Initial localStorage userId:", storedUserId);
    console.log("UserSetup: Initial localStorage role:", storedRole);
  }, []);

  const handleSave = () => {
    const trimmedUserId = inputUserId.trim();
    if (trimmedUserId) {
      localStorage.setItem('userId', trimmedUserId);
      localStorage.setItem('role', inputRole);
      
      const verifiedUserId = localStorage.getItem('userId');
      const verifiedRole = localStorage.getItem('role');
      console.log("UserSetup: Saved to localStorage. Verified userId:", verifiedUserId);
      console.log("UserSetup: Verified role:", verifiedRole);

      setMessage('User ID and Role saved successfully!');
      setMessageType('success');
      
      // Clear message after a short delay
      setTimeout(() => {
        if (inputRole === 'junior') {
          console.log("UserSetup: Navigating to /connections for Junior.");
          navigate('/connections');
        } else {
          console.log("UserSetup: Navigating to /senior-dashboard for Senior.");
          navigate('/senior-dashboard');
        }
      }, 500); // Give a moment for the message to be seen
      
    } else {
      setMessage('Please enter a User ID.');
      setMessageType('error');
      console.warn("UserSetup: Attempted to save with empty User ID.");
    }
  };

  const handleClearLocalStorage = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setInputUserId('');
    setInputRole('junior');
    setCurrentStoredUserId('');
    setCurrentStoredRole('');
    setMessage("Local storage cleared! Please set your ID and role again.");
    setMessageType('success');
    console.log("UserSetup: localStorage cleared for userId and role.");
    // No navigate here, as the component will re-render with empty fields
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl font-inter">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Set Your User ID and Role</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="mb-4 p-3 bg-gray-100 rounded-md text-sm text-gray-700">
        <p>Currently Stored ID: <strong>{currentStoredUserId || 'None'}</strong></p>
        <p>Currently Stored Role: <strong>{currentStoredRole || 'None'}</strong></p>
      </div>

      <div className="mb-4">
        <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">
          Your User ID:
        </label>
        <input
          type="text"
          id="userId"
          value={inputUserId}
          onChange={(e) => setInputUserId(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g., junior1, senior1"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
          Your Role:
        </label>
        <select
          id="role"
          value={inputRole}
          onChange={(e) => setInputRole(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out w-full mb-3"
      >
        Save and Continue
      </button>
      <button
        onClick={handleClearLocalStorage}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out w-full"
      >
        Clear Local Storage
      </button>
    </div>
  );
};

export default UserSetup;