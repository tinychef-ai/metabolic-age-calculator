import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const getAvatar = () => {
    if (message.type === 'system') {
      return '🤖';
    }
    return '👤';
  };

  return (
    <div className={`message ${message.type} slide-in`}>
      <div className="message-avatar">
        {getAvatar()}
      </div>
      <div className="message-content">
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
