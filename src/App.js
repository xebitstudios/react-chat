import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {

  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'Getting Started',
      timestamp: 'Today',
      messages: []
    }
  ]);
  
  const [selectedChatId, setSelectedChatId] = useState(1);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chatSessions');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      
      // Set first chat as selected if no active chat
      if (parsedChats.length > 0 && !selectedChatId) {
        setSelectedChatId(parsedChats[0].id);
      }
    } else {
      // Create initial chat session
      const initialChat = {
        id: Date.now(),
        title: 'New Chat',
        timestamp: new Date().toLocaleDateString(),
        messages: []
      };
      setChats([initialChat]);
      setSelectedChatId(initialChat.id);
    }
  }, []);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chats));
    }
  }, [chats]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      timestamp: new Date().toLocaleDateString(),
      messages: []
    };
    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleRenameChat = (chatId, newTitle) => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  // Function to add human message to a specific chat
  const addHumanMessage = (chatId, messageText) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          const newMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'human',
            timestamp: new Date().toLocaleTimeString()
          };
          
          // Update localStorage immediately
          const updatedChats = prevChats.map(c => 
            c.id === chatId 
              ? { ...c, messages: [...c.messages, newMessage] }
              : c
          );
          localStorage.setItem('chatSessions', JSON.stringify(updatedChats));
          
          return {
            ...chat,
            messages: [...chat.messages, newMessage]
          };
        }
        return chat;
      })
    );
  };

  // Function to add AI message to a specific chat
  const addAIMessage = (chatId, messageText) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          const newMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          };
          
          // Update localStorage immediately
          const updatedChats = prevChats.map(c => 
            c.id === chatId 
            ? {...c, messages: [...c.messages, newMessage]}
            : c
          );
          localStorage.setItem('chatSessions', JSON.stringify(updatedChats));
          
          return {
            ...chat,
            messages: [...chat.messages, newMessage]
          };
        }
        return chat;
      })
    );
  };

  // Function to call AI endpoint for response
  const handleSendMessage = async (chatId, message) => {
    // Add user message first
    addHumanMessage(chatId, message);

    // Get AI response from local API
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'symptoma/medgemma3:27b', // Change to your preferred model
          prompt: message,
          stream: false
        })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();      
      // Add AI response to the chat
      addAIMessage(chatId, data.response);

    } catch (error) {
      console.error('Error calling API:', error);
      
      // Add error message to chat
      setChats(chats.map(chat => {
        if (chat.id === chatId) {
          const errorMessage = {
            id: Date.now() + 1,
            text: `Error: ${error.message}`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          return { ...chat, messages: [...chat.messages, errorMessage] };
        }
        return chat;
      }));
    }
  };

  const currentChat = chats.find(chat => chat.id === selectedChatId) || chats[0];

  return (
    <div className="app">
      <Header />
      
      <div className="main-content">
        <Sidebar 
          chats={chats} 
          onSelectChat={handleSelectChat} 
          onNewChat={handleNewChat}
          selectedChatId={selectedChatId}
          onRenameChat={handleRenameChat}
        />
        
        <div className="chat-container">
          {currentChat ? (
            <Chatbot 
              chat={currentChat} 
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="empty-chat">
              <p>Select a chat or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;