
// src/components/MessageInput.js
import React from 'react';

const MessageInput = ({ onSend, value, onChange, onKeyDown }) => {
  return (
    <div className="flex p-4 bg-white border-t border-gray-200 gap-2">
      <textarea
        className="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
        rows={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Type your message here..."
        style={{ maxHeight: '100px' }}
      />
      <button
        onClick={onSend}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-200 ease-in-out"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;