import React from 'react';
import { Card, Divider } from 'antd';
import Avatar from '@/components/avatar';
import userPoster from '@/assets/img_1.png';

const { Meta } = Card;

const Home: React.FC = function () {
  const userInfo = {
    loginName: 'JohnDoe',
    uid: 123456,
    bio: 'Lorem ipsum dolor sit amet',
    email: 'johndoe@example.com',
    location: 'New York',
    createdAt: '2022-01-01',
    avatarUrl: 'https://example.com/avatar.jpg',
    username: 'John Doe',
  };

  const MetaDesc = (
    <div className="meta-desc">
      <div className="loginname">{userInfo.loginName}</div>
      <div>UID: {userInfo.uid}</div>
      <div>Intro: {userInfo.bio}</div>
      <div>Email: {userInfo.email}</div>
      <div>Region: {userInfo.location}</div>
      <div>Register Time: {userInfo.createdAt}</div>
    </div>
  );

  return (
    <div style={{marginLeft:"15px"}}>
      <Divider orientation="left" plain>
        Home
      </Divider>
      <Card style={{ width: 370 }} cover={<img alt="" src={userPoster} className="poster" />}>
        <Meta
          avatar={<Avatar src={userInfo.avatarUrl} size="large" />}
          title={userInfo.username}
          description={MetaDesc}
        />
      </Card>
    </div>
  );
};

export default Home;
