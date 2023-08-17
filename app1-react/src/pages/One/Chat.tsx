import React, { useEffect, useState } from 'react';
import { Input, Button, Avatar, Card } from 'antd';

const Chat = ({ friend }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [websocket, setWebsocket] = useState(null);
  let ws = new WebSocket(`ws://localhost:7004/chat?username=${localStorage.getItem('name')}`);
  ws.onopen = function() {
    console.log("Connection open.");
  };
  ws.onmessage = function(res) {
    console.log("Received message: " + res.data)
    const newMessage = parseReceivedMessage(res.data);
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };


  useEffect(() => {
    const savedMessages = localStorage.getItem('message_data')
      ? JSON.parse(localStorage.getItem('message_data'))
      : [];
    const friendMessages = savedMessages.filter(
      msg => msg.from === friend.name || msg.to === friend.name
    );

    setMessages(friendMessages);
  }, [friend]);

  const handleSendMessage = () => {
    if (newMessage === '') return;
    console.log("Sending message: " + newMessage.trim())

    const message = `${localStorage.getItem('name')};${friend.name};${newMessage};${new Date().toISOString().slice(0,19)}`;
    if (ws) {
      console.log("Sending message: " + message)
      ws.send(message);
    }

    const messageObject = { from: localStorage.getItem('name'), to: friend.name, content: newMessage, time: new Date().toISOString().slice(0,19) };

    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, messageObject];
      localStorage.setItem('message_data', JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setNewMessage('');
  };
  
  const parseReceivedMessage = (payload) => {
    const [from, content, time] = payload.split(';');
    return { from, content, time };
  };

  return (
    <Card className="chat-container">
      <div className="chat-header">
        <Avatar src={friend.avatar} />
        <span className="friend-name">{friend.name}</span>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            className={`message ${message.from === localStorage.getItem('name') ? 'me' : 'friend'}`}
            key={index}
          >
            {message.from === localStorage.getItem('name') ? 'me' : message.from}:<span className="message-content">{message.content}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="input message..."
        />
        <Button type="primary" onClick={handleSendMessage}>
          send
        </Button>
      </div>
    </Card>
  );
};

export default Chat;
