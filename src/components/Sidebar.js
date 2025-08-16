import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ chats, onSelectChat, onNewChat, selectedChatId, onRenameChat }) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const aiModels = [
    { id: 'claude-sonnet-3.5', model: 'Claude Sonnet 3.5', },
    { id: 'claude-sonnet-4', model: 'Claude Sonnet 3.5', },
    { id: 'openai-gpt-4o', model: 'OpenAI GPT-4o', },
  ];

  const handleModelChange = e => {
    e.preventDefault();
    const { value } = e.target;
    console.log('Selected model: ' + value);
  };

  const handleStartEdit = (chatId, currentTitle) => {
    setEditingChatId(chatId);
    setEditValue(currentTitle);
  };

  const handleSaveEdit = (chatId) => {
    if (editValue.trim() && chatId) {
      onRenameChat(chatId, editValue.trim());
    }
    setEditingChatId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditValue('');
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(chatId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <label className='modelselector'>
          Select Model:
          <select
            name="modelId" 
            value={aiModels.id}
            onChange={handleModelChange}
            style={{ padding: '10px', alignContent: 'center' }}
            required
          >
             {aiModels.map(s => (
              <option key={s.id} value={s.model}>
                {s.id}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={onNewChat}>
          + New Chat
        </button>
      </div>
      
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            {editingChatId === chat.id ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(chat.id)}
                  onKeyPress={(e) => handleKeyPress(e, chat.id)}
                  autoFocus
                  className="edit-input"
                />
                <button 
                  className="save-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit(chat.id);
                  }}
                >
                  ✓
                </button>
              </div>
            ) : (
              <div className="chat-item-content">
                <div 
                  className="chat-title"
                  onDoubleClick={() => handleStartEdit(chat.id, chat.title)}
                >
                  {chat.title}
                </div>
                <div className="chat-timestamp">{chat.timestamp}</div>
                <button
                  className="rename-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(chat.id, chat.title);
                  }}
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;