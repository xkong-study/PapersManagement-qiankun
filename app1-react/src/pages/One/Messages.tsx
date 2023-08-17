import React, { useState } from 'react';
import { Layout, Menu, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Inbox from './Inbox';
import Chat from './Chat';
import avatar0 from '../../assets/img_1.png';
import avatar1 from '../../assets/img_2.png';
import avatar2 from '../../assets/img_3.png';
import avatar3 from '../../assets/img_4.png';

const { Header, Content, Sider } = Layout;

const getRandomAvatar = () => {
  const i = Math.floor(Math.random() * 5)+1;
  return require(`../../assets/img_${i}.png`);
};

const App = () => {
  const [currentFriend, setCurrentFriend] = useState(null);
  const [friendUsername, setFriendUsername] = useState('');
  const [friendList, setFriendList] = useState([
    { id: 1, name: 'John Doe', avatar: avatar1 },
    { id: 2, name: 'Jane Smith', avatar: avatar2 },
    { id: 3, name: 'Mike Johnson', avatar: avatar3 },

  ]);

  const avatar = getRandomAvatar();

  const handleFriendSelect = (friend) => {
    setCurrentFriend(friend);
  };

  const handleFriendRequest = () => {
    const newFriend = { id: friendList.length + 1, name: friendUsername, avatar: avatar };
    setFriendList([...friendList, newFriend]);
    setFriendUsername('');
  };

  const handleInboxClick = () => {
    console.log(currentFriend);
    setCurrentFriend(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: '#fff', textAlign: 'center' }}>
        <h1>Inbox and live chat</h1>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu mode="inline">
            <Menu.Item key="inbox" onClick={handleInboxClick} icon={<MailOutlined />}>
              Inbox
            </Menu.Item>
            {friendList.map((friend) => (
              <Menu.Item key={friend.id} onClick={() => handleFriendSelect(friend)}>
                <img src={friend.avatar} alt={friend.name} style={{ width: '25px', borderRadius: '25px' }} />
                <span>{friend.name}</span>
              </Menu.Item>
            ))}
          </Menu>
          <div style={{ padding: '12px' }}>
            <Input
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              placeholder="input friend's name"
              style={{ marginBottom: '8px' }}
            />
            <Button type="primary" onClick={handleFriendRequest}>
              add friends
            </Button>
          </div>
        </Sider>
        <Content style={{ padding: '24px' }}>
          {currentFriend ? (
            <Chat friend={currentFriend} avatar={avatar} />
          ) : (
            <Inbox friendList={friendList} onFriendSelect={handleFriendSelect} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
