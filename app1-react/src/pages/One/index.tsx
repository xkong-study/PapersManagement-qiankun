import TableComponet from '@/pages/TableList';
import { Button, Form, Input, Tabs } from 'antd';
import { commonUtil } from 'qiankun-common';
import { Route } from 'umi';
import React, { useState,useEffect } from 'react'
import './index.less'
import Sidebar from '@/components/sidebar'
import { Provider } from 'react-redux';
import MainContent from './content'
import { Layout,Alert } from 'antd'

export interface HomeMainState {
  collapsed?: boolean
  setCollapsed?: () => void
}

const One: React.FC = function () {
  const [currentMessage, setCurrentMessage] = useState(JSON.parse(localStorage.getItem('currentMessage')) || null);
  const [message_notifications, setMessageNotifications] = useState(localStorage.getItem('message_notifications') || false);
  // Create a function to update the currentMessage state

  useEffect(() => {
    // Function to check and update the state
    const checkAndUpdateMessageNotifications = () => {
      const storedValue = localStorage.getItem('message_notifications');
      const newValue = storedValue === 'true';
      setMessageNotifications(newValue);
    };

    // Call the function initially
    checkAndUpdateMessageNotifications();

    // Set up a timer to call the function every 5 seconds
    const interval = setInterval(() => {
      checkAndUpdateMessageNotifications();
    }, 3000);

    // Clean up the timer on component unmount
    return () => clearInterval(interval);
  }, []);

  const updateMessage = () => {
    const message = JSON.parse(localStorage.getItem('currentMessage')) || null;
    const isEmailNotificationEnabled = localStorage.getItem('message_notifications');

    // Only update the state if the message has changed
    if (message !== currentMessage) {
      setCurrentMessage(message);
    }
    if(isEmailNotificationEnabled !== message_notifications){
      setMessageNotifications(isEmailNotificationEnabled);
    }
  };

  // Use useEffect to call updateMessage every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(updateMessage, 2000);
    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, [currentMessage]); // Passing [currentMessage] as the second argument ensures that the effect only reruns when currentMessage changes

  return (
    <section className="home-main">
      {currentMessage !== null && message_notifications == "true" && <Alert message={currentMessage.from + ":" + currentMessage.content} type="success" />}
      <Layout>
        <Sidebar />
        <Layout className="home-layout">
          <MainContent id="container">
          </MainContent>
        </Layout>
      </Layout>
    </section>
  );
};

export default One;
