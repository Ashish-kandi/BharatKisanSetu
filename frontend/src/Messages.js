import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, IconButton, Avatar, Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useLocation } from 'react-router-dom';

const demoMessages = [
  { from: 'Consumer1', text: 'Is your tomato organic?', time: '10:15 AM', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { from: 'Farmer', text: 'Yes, all my products are organic!', time: '10:16 AM', avatar: '' },
  { from: 'Consumer1', text: 'Great! I want to order 10kg.', time: '10:17 AM', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }
];

function Messages() {
  const location = useLocation();
  const defaultFarmer = { name: "Farmer", phone: "", address: "" };
  let farmer = defaultFarmer;
  if (location.state && location.state.farmer) {
    farmer = location.state.farmer;
    localStorage.setItem('farmer', JSON.stringify(farmer));
  } else {
    const stored = localStorage.getItem('farmer');
    if (stored) {
      try { farmer = JSON.parse(stored); } catch { farmer = defaultFarmer; }
    }
  }

  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        from: farmer.name,
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: ''
      }
    ]);
    setInput('');
  };

  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        bgcolor: '#f6fbf9'
      }}
    >
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: 600,
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        p: 0,
        overflow: 'hidden'
      }}>
        <Box sx={{ bgcolor: '#43e97b', color: '#1b4332', p: 2 }}>
          <Typography variant="h5" fontWeight={700}>Messages</Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            bgcolor: '#f9fbe7',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.map((msg, idx) => {
            const isFarmer = msg.from === farmer.name;
            return (
              <Stack
                key={idx}
                direction="row"
                spacing={1}
                justifyContent={isFarmer ? "flex-end" : "flex-start"}
                sx={{ mb: 2 }}
              >
                {!isFarmer && (
                  <Avatar src={msg.avatar} alt={msg.from} sx={{ width: 32, height: 32 }} />
                )}
                <Box
                  sx={{
                    maxWidth: '65%',
                    bgcolor: isFarmer ? '#e0ffe4' : 'white',
                    color: '#1b4332',
                    borderRadius: 2,
                    p: 1.5,
                    boxShadow: 1,
                    alignSelf: isFarmer ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{msg.text}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ float: 'right' }}>
                    {msg.time}
                  </Typography>
                </Box>
                {isFarmer && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#43e97b', color: '#fff' }}>
                    {farmer.name[0]}
                  </Avatar>
                )}
              </Stack>
            );
          })}
          <div ref={chatEndRef} />
        </Box>
        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderTop: '1px solid #e0e0e0',
            bgcolor: '#f6fbf9'
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            sx={{ mr: 2, bgcolor: 'white', borderRadius: 2 }}
          />
          <IconButton type="submit" color="primary" sx={{ bgcolor: '#43e97b', color: '#1b4332', '&:hover': { bgcolor: '#38e97b' } }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

export default Messages;
