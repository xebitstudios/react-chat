import React, { useState } from 'react';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegHandPaper, FaRegCopy, FaRegShareSquare } from "react-icons/fa";
import './Chatbot.css';

const feedbackOptions = [
  { value: 'copy', label: 'Copy', icon: <FaRegCopy size="2em" /> },
  { value: 'up', label: 'Thumbs Up', icon: <FaRegThumbsUp size="2em" /> },
  { value: 'maybe', label: 'Maybe', icon: <FaRegHandPaper size="2em" /> },
  { value: 'down', label: 'Thumbs Down', icon: <FaRegThumbsDown size="2em" /> },
  { value: 'share', label: 'Share', icon: <FaRegShareSquare size="2em" /> },
];

// Markdown formatting function
const formatMarkdown = (text) => {
    if (!text) return '';
    
    // Convert markdown to HTML
    let formattedText = text;
    
    // Handle headers (# Header)
    formattedText = formattedText.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    formattedText = formattedText.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    formattedText = formattedText.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Handle bold text (**bold**)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic text (*italic*)
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle inline code (`code`)
    formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Handle code blocks (```code```)
    formattedText = formattedText.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Handle lists
    formattedText = formattedText.replace(/^- (.*$)/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/(<li>.*<\/li>)+/gs, '<ul>$&</ul>');
    
    // Handle line breaks
    formattedText = formattedText.replace(/\n\n/g, '</p><p>');
    formattedText = formattedText.replace(/\n/g, '<br/>');
    
    // Wrap in paragraph tags if not already wrapped
    if (!formattedText.startsWith('<')) {
      formattedText = `<p>${formattedText}</p>`;
    }
    
    return formattedText;
};

const Chatbot = ({ chat, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
      id: '',
      value: '',
      model: ''
  });
  const handleFeedbackClick = option => {
    setFeedback(option.value);
    console.log(option.value);
  };
  const handleSubmitFeedback = e => {
    const { id, fm, model } = e.target;
    setFeedbackData(prev => ({ ...prev, [id]: id, [fm]: fm, [model]: model }));
    const payload = {
      ...feedbackData,
      feedback
    };
    console.log('Feedback Submitted:', payload);
    alert(JSON.stringify(payload, null, 2));
    // Reset feedback if you wish
    // setFeedbackData({ id: '', fm: '', model: '' });
    // setFeedback(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && chat) {
      onSendMessage(chat.id, inputValue);
      setInputValue('');
    }
  };

  // Ensure chat.messages exists and is an array
  const messages = chat?.messages || [];

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <p>Hi there! How can I help you today?</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                {/* {message.text} */}
                <div className="message-text" dangerouslySetInnerHTML={{ __html: message.sender === 'ai' ? formatMarkdown(message.text) : message.text }} />
                <br />
                <div className="feedback-icons">
                  {feedbackOptions.map(option => (
                    <button
                      key={option.value} 
                      type="button" 
                      className={`icon-btn feedback-button ${
                        feedback === option.value ? 'selected' : ''
                      }`}
                      onClick={() => handleFeedbackClick(option)}
                    >
                      {option.icon}
                      {/* <span className="sr-only">{option.label}</span> */}
                    </button>
                  ))}
                </div>
              </div>
              {/* <div className="message-content">
                <div className="message-text" dangerouslySetInnerHTML={{ __html: message.sender === 'ai' ? formatMarkdown(message.text) : message.text }} />
              </div> */}
            </div>
          ))
        )}
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;