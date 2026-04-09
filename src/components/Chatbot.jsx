import React, { useState } from 'react';
import { chatAPI } from '../services/apiClient';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm InvestAI's RAG Assistant. Ask me about your portfolio or market strategies.", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    const currentInput = input;
    setInput('');

    try {
      const res = await chatAPI.query(currentInput, 'session-123');
      setMessages(prev => [...prev, { text: res.response || res.message || "I found some resources.", sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Network issue contacting RAG agent.", sender: 'bot' }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: '#2563eb', color: 'white', border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)', cursor: 'pointer',
          fontSize: '24px', zIndex: 9999
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '350px', height: '400px', backgroundColor: 'white',
          borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 9999
        }}>
          <div style={{ padding: '15px', backgroundColor: '#1e293b', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>RAG Financial Assistant</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>✕</button>
          </div>
          
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#2563eb' : '#f1f5f9',
                color: msg.sender === 'user' ? 'white' : 'black',
                padding: '10px', borderRadius: '8px', maxWidth: '80%'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about strategies..."
              style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px' }}
            />
            <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0 4px 4px 0' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
