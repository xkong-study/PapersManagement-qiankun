import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SystemInfo.less';
import { Row, Col, Card,List,Avatar } from 'antd';
import noData from '../assets/img.png';
import img from '../assets/img_1.png';
import { commonUtil } from 'qiankun-common';
import {useHistory} from 'react-router-dom';
import avatar1 from '../assets/img_2.png';

const MessageItem = ({ content }) => {
  return (
    <div className="message-item">
      <div className="message-content">{content}</div>
    </div>
  );
};

const System = () => {
  const [messageList, setMessageList] = useState([]);
  const [markList, setMarkList] = useState([]);
  const [message, setMessage] = useState(
    localStorage.getItem('message_data')
      ? JSON.parse(localStorage.getItem('message_data'))
      : []
  );
  const [friends, setFriends] = useState([]);
  const username = localStorage.getItem('name');

  useEffect(() => {
    const messageSenders = message.map(msg => msg.from);
    const uniqueSenders = [...new Set(messageSenders)];

    const friendsList = uniqueSenders.map(sender => {
      const count = message.filter(msg => msg.to === username).length;
      return { name: sender, avatar: avatar1, unreadCount: count }; // Here you need to find a way to map sender to avatar
    });

    setFriends(friendsList);
  }, [message]);


  useEffect(() => {
    const fetchPapersAndMarks = async () => {
      try {
        // 获取文章标题
        const paperSearchResponse = await axios.get('http://localhost:7002/api/paper/search', {
          params: {
            searchTerm: localStorage.getItem("name"),
          },
        });

        if (paperSearchResponse.data.length > 0) {
          const paperTitle = paperSearchResponse.data[0].title;

          // 使用文章标题获取文章详情
          const paperDetailResponse = await axios.get('http://localhost:7002/api/paper/search/detail', {
            params: {
              title: paperTitle,
              keyword: 'tag12',
            },
          });

          if (paperDetailResponse.data.length > 0) {
            const comments = paperDetailResponse.data[0].comments;

            // 计算平均分
            const totalRating = comments.reduce((total, comment) => total + comment.rating, 0);
            const averageRating = totalRating / comments.length;

            // 将成绩数据添加到 markList
            const newMark = {
              id: markList.length + 1,
              score: averageRating,
              article: paperTitle,
            };
            setMarkList((prevMarkList) => [...prevMarkList, newMark]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPapersAndMarks();
  }, []);

  const e = "/save"
  const history = useHistory()

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24 }} className="system-data">
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card title="Paper Learning" hoverable>
          <div className="item-text" onClick={() => history.push(`/api/childOnePageOne?id=${e}`)}>
            <em>Total number: </em>
            1000
          </div>
          <img
            src={img}
            alt="data visualisation"
            style={{ width: '40%', objectFit: 'cover', borderRadius: "25px", marginTop: "10px" }}
          />
        </Card>
      </Col>

      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card title="My message" hoverable>
          {friends.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={friends}
              renderItem={(friend) => (
                <List.Item
                  style={{ cursor: 'pointer' }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={friend.avatar} />}
                    title={friend.name}
                    description={`unread messages: ${friend.unreadCount}`}
                    onClick={() => commonUtil.qiankunJump(`/api/childOnePageOne?id=/message`)}
                  />
                </List.Item>
              )}
            />
          ) : (
            <img
              src={noData}
              alt="empty"
              style={{
                transform: 'scale(0.4)',
                height: '20rem',
                overflow: 'hidden',
                width:"100%",
                marginTop: "-6rem"
              }}
            />
          )}
        </Card>
      </Col>

      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card title="Marks" hoverable className="mem">
          {markList.length > 0 ? (
            markList.map((mark) => (
              <div key={mark.id} style={{fontSize:"1rem"}} onClick={() => commonUtil.qiankunJump(`/api/childTwoMenu/pageSeven?key=${mark.article}`)}>Article: {mark.article} -----Score: {mark.score.toFixed(2)}</div>
            ))
          ) : (
            <div>No data</div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default System;
