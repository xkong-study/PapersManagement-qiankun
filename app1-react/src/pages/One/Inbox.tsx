import React, { useState, useEffect } from 'react';
import { List, Avatar,Alert } from 'antd';
import avatar0 from '../../assets/img_1.png';
import avatar1 from '../../assets/img_2.png';
import avatar2 from '../../assets/img_3.png';
import avatar3 from '../../assets/img_4.png';

const Inbox = ({ onFriendSelect }) => {
  const [friends, setFriends] = useState([]);
  const username = localStorage.getItem('name')
  let ws = new WebSocket(`ws://localhost:7004/chat?username=${username}`);
  const [message, setMessage] = useState(
    localStorage.getItem('message_data')
      ? JSON.parse(localStorage.getItem('message_data'))
      : []
  );

  ws.onopen = () => {
    console.log('connected')
  };
  const [currentMessage, setCurrentMessage] = useState(null);
  const [new_, setNew] = useState(null);
  ws.onmessage = function(res) {
    const newMessageString = res.data;
    let parts = newMessageString.split(";");
// Construct the new message object
    let newMessage = {from: parts[0], to: "xkong", content: parts[1], time: parts[2]};
    setNew(newMessage)
    setMessage(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage];
      localStorage.setItem('message_data', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
    console.log('message received: ' + res.data)
  };

  useEffect(()=>{
    localStorage.setItem('currentMessage', JSON.stringify(new_));
  },[new_])

  useEffect(() => {
    const messageSenders = message.map(msg => msg.from);
    const uniqueSenders = [...new Set(messageSenders)];

    const friendsList = uniqueSenders.map(sender => {
      const count = message.filter(msg => msg.to === username).length;
      return { name: sender, avatar: avatar1, unreadCount: count }; // Here you need to find a way to map sender to avatar
    });

    setFriends(friendsList);
  }, [message]);

  const handleFriendClick = (friend) => {
    onFriendSelect(friend);
  };

  return (
    <div>
      <h2>Inbox</h2>
      <List
        itemLayout="horizontal"
        dataSource={friends}
        renderItem={(friend) => (
          <List.Item
            style={{ cursor: 'pointer' }}
            onClick={() => handleFriendClick(friend)}
          >
            <List.Item.Meta
              avatar={<Avatar src={friend.avatar} />}
              title={friend.name}
              description={`unread messages: ${friend.unreadCount}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Inbox;
