import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import tuftsLogo from './Tufts_univ_blue.png';
import AboutMe from './AboutMe';
import jumbo from './pngegg.png';
import sendButton from './pngegg (1).png';

// Access the API key from environment variables
const API_KEY = process.env.REACT_APP_API_KEY;

// TypingEffect Component
const TypingEffect = ({ message, onComplete }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping || index >= message.length) return;

    const interval = setInterval(() => {
      setDisplayedMessage((prev) => prev + message.charAt(index));
      setIndex((prevIndex) => prevIndex + 1);

      if (index + 1 >= message.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    }, 5); // Adjust speed as needed

    return () => clearInterval(interval);
  }, [index, message, isTyping, onComplete]);

  return <span>{displayedMessage}</span>;
};

// TypingTest Component
const TypingTest = () => {
  const [displayed, setDisplayed] = useState('');
  const message = 'Hello, world!';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + message.charAt(index));
      index++;
      if (index >= message.length) clearInterval(interval);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return <div>{displayed}</div>;
};

// Main App Component
const App = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const applyHoverEffect = (e) => e.target.classList.add('button-hover');
  const resetHoverEffect = (e) => e.target.classList.remove('button-hover');
  const handleInputChange = (e) => setInputMessage(e.target.value);

  const sendMessage = async (text, sender) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newUserMessage = { author: sender, text: trimmedText, typingCompleted: false };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [...messages, { author: 'user', text: trimmedText }].map((msg) => ({
        role: msg.author === 'user' ? 'user' : 'system',
        content: msg.text,
      })),
    };

    console.log(`Authorization Header: Bearer ${API_KEY}`); // Debugging line

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorResponse = await response.text(); // Fetch complete error response
        console.error('API Response Error:', errorResponse); // Log complete error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = { author: 'ai', text: data.choices[0].message.content, typingCompleted: false };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { author: 'ai', text: "I'm having trouble connecting to the server. Please try again later.", typingCompleted: true },
      ]);
    }
  };

  const handleSendMessage = (query) => {
    sendMessage(query, 'user');
    setInputMessage('');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <BrowserRouter>
      <div className="top-left-logo" onClick={() => window.location.reload()}>
        <img src={tuftsLogo} alt="Tufts University" style={{ cursor: 'pointer', position: 'fixed', top: '60px', left: '25px', maxWidth: '125px', height: 'auto', zIndex: 1000 }} />
      </div>
      <div className="top-banner">
        Welcome to JumboAI, our latest AI model. <Link to="/about-me">Learn more.</Link>
      </div>
      <Routes>
        <Route path="/" element={
          <div className={`page ${messages.length > 0 ? 'chat-active' : ''}`}>
            {messages.length === 0 && (
              <>
                <header className="header">How can I help you today?</header>
                <img src={jumbo} alt="Jumbo" className="jumbo-elephant" />
                <div className="button-group">
                  <button
                    className="button"
                    onMouseEnter={applyHoverEffect}
                    onMouseLeave={resetHoverEffect}
                    onClick={() => handleSendMessage('Tell me about admission requirements and deadlines at Tufts')}
                  >
                    Admission requirements and deadlines
                  </button>
                  <button
                    className="button"
                    onMouseEnter={applyHoverEffect}
                    onMouseLeave={resetHoverEffect}
                    onClick={() => handleSendMessage('What programs or majors do you offer at Tufts?')}
                  >
                    Programs or majors offerings
                  </button>
                  <button
                    className="button"
                    onMouseEnter={applyHoverEffect}
                    onMouseLeave={resetHoverEffect}
                    onClick={() => handleSendMessage('What are the tuition costs and financial aid options at Tufts?')}
                  >
                    Tuition costs and financial aid options
                  </button>
                  <button
                    className="button"
                    onMouseEnter={applyHoverEffect}
                    onMouseLeave={resetHoverEffect}
                    onClick={() => handleSendMessage('What campus facilities and resources are available at Tufts?')}
                  >
                    Campus facilities and resources availability
                  </button>
                </div>
              </>
            )}
            <div className="message-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.author}`}>
                  {msg.author === 'user' ? (
                    <span>{msg.text}</span>
                  ) : (
                    <TypingEffect
                      message={msg.text}
                      onComplete={() => {
                        setMessages((prevMessages) => {
                          const updatedMessages = [...prevMessages];
                          updatedMessages[index].typingCompleted = true;
                          return updatedMessages;
                        });
                      }}
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-box-container">
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Message JumboAI..."
                  className="input"
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSendMessage(inputMessage);
                    }
                  }}
                />
                <button className="send-button" onClick={() => handleSendMessage(inputMessage)}>
                  <img src={sendButton} alt="Send" style={{ maxWidth: '20px', height: 'auto' }} />
                </button>
              </div>
            </div>
          </div>
        } />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/typing-test" element={<TypingTest />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
