import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: 500,
    margin: '40px auto',
    border: '1px solid #ddd',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(44,62,80,0.08)',
    background: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    height: 600,
  },
  header: {
    background: '#2d6a4f',
    color: '#fff',
    padding: '16px 20px',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ffd60a',
  },
  chatBody: {
    flex: 1,
    padding: 20,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: '#e0f7fa',
  },
  messageRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  message: {
    background: '#ffd60a',
    color: '#2d6a4f',
    borderRadius: 16,
    padding: '8px 16px',
    maxWidth: '70%',
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  messageOther: {
    background: '#fff',
    color: '#2d6a4f',
    borderRadius: 16,
    padding: '8px 16px',
    maxWidth: '70%',
    alignSelf: 'flex-start',
    marginBottom: 4,
    border: '1px solid #e0e0e0',
  },
  inputRow: {
    display: 'flex',
    borderTop: '1px solid #ddd',
    background: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  sendBtn: {
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
  },
  backBtn: {
    background: '#ffd60a',
    color: '#2d6a4f',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    marginRight: 8,
  }
};

const initialMessages = [
  { from: 'farmer', text: 'Hello! How can I help you?' }
];

// Simple keyword-based reply logic
function getSmartReply(userText) {
  const text = userText.toLowerCase();
  if (text.includes('price') || text.includes('cost')) {
    return "The current price is ₹45 per kg. Would you like to place an order?";
  }
  if (text.includes('available') || text.includes('stock')) {
    return "Yes, the product is available. How many kilos do you need?";
  }
  if (text.includes('location') || text.includes('where')) {
    return "I am based in Nalgonda, Telangana. Delivery is available nearby.";
  }
  if (text.includes('organic')) {
    return "Yes, all my produce is 100% organic and chemical-free!";
  }
  if (text.includes('hello') || text.includes('hi')) {
    return "Hello! How can I assist you today?";
  }
  if (text.includes('thanks') || text.includes('thank you')) {
    return "You're welcome! Let me know if you have more questions.";
  }
  if (text.includes('order')) {
    return "Great! Please tell me the quantity and your address to proceed.";
  }
  return "Thank you for your message! I'll get back to you as soon as possible.";
}

function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const farmer =
    location.state?.farmer ||
    JSON.parse(localStorage.getItem('farmer')) || {
      name: 'Ramesh Kumar',
      avatar: 'https://i.ibb.co/3T2TtL8/farmer-avatar.jpg',
    };

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages([...messages, { from: 'me', text: userMessage }]);
    setInput('');
    // Simulate smart farmer reply after a delay
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { from: 'farmer', text: getSmartReply(userMessage) }
      ]);
    }, 900);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <img src={farmer.avatar} alt={farmer.name} style={styles.avatar} />
        <span style={{ fontWeight: 700, fontSize: 20 }}>{farmer.name}</span>
      </div>
      <div style={styles.chatBody}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={msg.from === 'me' ? styles.messageRow : { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <div style={msg.from === 'me' ? styles.message : styles.messageOther}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button style={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
