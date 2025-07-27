
// src/components/MessageBubble.js
import React from 'react';

const MessageBubble = ({ message, isSender }) => {
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      // Increased max-w-[75%] to max-w-[90%]
      className={`relative px-4 py-2 rounded-xl shadow-sm mb-3 max-w-[90%] text-sm font-medium break-words whitespace-pre-wrap cursor-pointer
        ${isSender
          ? 'bg-blue-500 text-white ml-auto rounded-br-none'
          : 'bg-gray-200 text-gray-800 mr-auto rounded-bl-none'
        }
        flex items-end gap-2
      `}
    >
      <div className="flex-grow">
        {message.text}
      </div>

      <div className={`text-[10px] flex-shrink-0 ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
        {formatTime(message.timestamp)} {message.edited && <span className="ml-1">(edited)</span>}
      </div>
    </div>
  );
};

export default MessageBubble;