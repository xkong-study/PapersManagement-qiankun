import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedKeys } from '../../store/reducer';
import { PaperClipOutlined } from '@ant-design/icons';
import {link} from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = function () {
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedKeys = useSelector((state: any) => state.selectedKeys);
  const onClick = (e: any) => {
    history.push(`/api/childOnePageOne?id=${e.key}`);
  };

  return (
    <Sider trigger={null} width={200} className="sidebar">
      <Menu
        selectedKeys={[selectedKeys]}
        onClick={onClick}
        mode="inline"
        className="bar_font"
        style={{ backgroundColor:'#white' }}
      >
        <Menu.Item key="/home" icon={<PaperClipOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="/message" icon={<PaperClipOutlined />}>
          Message
        </Menu.Item>
        <Menu.Item key="/info" icon={<PaperClipOutlined />}>
          Info
        </Menu.Item>
        <Menu.Item key="/account" icon={<PaperClipOutlined />}>
          Account
        </Menu.Item>
        <Menu.Item key="/save" icon={<PaperClipOutlined />}>
          Save
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
