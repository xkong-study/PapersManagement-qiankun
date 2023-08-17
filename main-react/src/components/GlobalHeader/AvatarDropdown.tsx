import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import avatar0 from '../../assets/img_1.png';

const AvatarDropdown = ({ menu }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 模拟获取用户数据的异步操作
    setTimeout(() => {
      setCurrentUser({
        avatar: avatar0, // 这只是一个示例 URL，请替换为实际的图片 URL
        name: localStorage.getItem('name'),
      });
    }, 1000);
  }, []);

  const onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      // 处理退出登录的逻辑
      return;
    }

    history.push(`/api/childOnePageOne`);
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {!menu && (
        <Menu.Item key="center">
          <UserOutlined />
          Personal Center
        </Menu.Item>
      )}
      {!menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          Personal Settings
        </Menu.Item>
      )}
      {!menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return currentUser ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
};

export default AvatarDropdown;
