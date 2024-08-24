import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  const connectWebSocket = () => {
    // Replace with your actual WebSocket URL
    ws.current = new WebSocket('wss://dxw1cdn64m.execute-api.us-east-1.amazonaws.com/dev/');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  };

  const disconnectWebSocket = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  const sendMessage = () => {
    if (input.trim() && connected) {
      const message = JSON.stringify({
        action: 'send', // Ensure this matches your API Gateway route
        data: input,
      });

      ws.current.send(message);
      setInput('');
    }
  };

  return (
    <Container maxWidth="sm" className="chat-container">
      <Typography variant="h4" align="center" gutterBottom>
        Chat Application
      </Typography>
      <div className="connection-buttons">
        <Button
          variant="contained"
          color="success"
          onClick={connectWebSocket}
          disabled={connected}
          style={{ marginRight: '10px' }}
        >
          Connect
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={disconnectWebSocket}
          disabled={!connected}
        >
          Disconnect
        </Button>
      </div>
      <Paper elevation={3} className="chat-box">
        <List className="message-list">
          {messages.map((msg, index) => (
            <ListItem key={index} className="message-item">
              <ListItemText primary={msg.data || msg} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <div className="input-container">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={!connected}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={sendMessage}
          className="send-button"
          disabled={!connected}
        >
          Send
        </Button>
      </div>
    </Container>
  );
}

export default App;
