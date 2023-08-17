import React, { useState,useEffect } from 'react';
import { Card, Divider, Switch } from 'antd';
import 'antd/dist/antd.css';
import './info.less'


interface Notification {
  id: string;
  content: string;
  isEmailNotificationEnabled: boolean;
}

interface Todo {
  id: string;
  task: string;
  isCompleted: boolean;
}

const messageNotifications: Notification[] = [
  {
    id: '1',
    content: 'New message notification 1',
    isEmailNotificationEnabled: true,
  },
  {
    id: '2',
    content: 'New message notification 2',
    isEmailNotificationEnabled: false,
  },
];

const todoList: Todo[] = [
  {
    id: '1',
    task: 'completed1',
    isCompleted: false,
  },
  {
    id: '2',
    task: 'completed2',
    isCompleted: true,
  },
];

const Info: React.FC = () => {
  const [isEmailNotificationEnabled, setEmailNotificationEnabled] = useState(localStorage.getItem('message_notifications'));
  const [isThingNotificationEnabled, setThingNotificationEnabled] = useState(
    false
  );

  useEffect(() => {
    localStorage.setItem('message_notifications', isEmailNotificationEnabled.toString());
  }, [isEmailNotificationEnabled]);

  const renderMessageNotifications = () => {
    return (
      <div>
        <div style={{display:"flex",marginTop:"10px"}}>
        <h2>notification</h2>
          <Switch
            checked={isEmailNotificationEnabled}
            onChange={(checked) => {
              setEmailNotificationEnabled(checked);
              localStorage.setItem('message_notifications', String(checked));
            }}
            className="notification-switch"
          />

        </div>
        <Divider />
        {messageNotifications.map(notification => (
          <Card key={notification.id} className="notification-card">
            <p>{notification.content}</p>
          </Card>
        ))}
      </div>
    );
  };

  const renderTodoList = () => {
    return (
      <div>
        <div style={{display:"flex",marginTop:"20px"}}>
        <h2>Upcoming Tasks</h2>
        <Switch
          checked={isThingNotificationEnabled}
          onChange={setThingNotificationEnabled}
          className="notification-switch"
        />
        </div>
        <Divider />
        {todoList.map(todo => (
          <Card
            key={todo.id}
            className={`todo-card ${todo.isCompleted ? 'completed' : ''}`}
          >
            <p>{todo.task}</p>
            {todo.isCompleted ? <p>completed</p> : <p>undone</p>}
          </Card>
        ))}
      </div>
    );
  };

  const handleEmailNotificationChange = (
    checked: boolean,
    notificationId: string
  ) => {
    // 更新对应通知的邮件通知状态
    // 您可以在此处处理状态更新的逻辑
    const updatedNotifications = messageNotifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          isEmailNotificationEnabled: checked,
        };
      }
      return notification;
    });
    // 更新通知列表的状态
    setMessageNotifications(updatedNotifications);
  };

  return (
    <div style={{marginLeft:"15px"}}>
      {renderMessageNotifications()}
      {renderTodoList()}
    </div>
  );
};

export default Info;
