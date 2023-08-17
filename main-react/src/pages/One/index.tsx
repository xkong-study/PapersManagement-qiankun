import React, { useState, useEffect } from 'react';
import { List, Avatar, Space, Rate, Input, Comment, Form, Modal, Card } from 'antd';
import { StarOutlined, MessageOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import axios from 'axios';

const { TextArea } = Input;
const { Search } = Input;

const IconText = ({ icon, text, onClick }) => (
  <Space onClick={onClick}>
    {React.createElement(icon)}
    {text}
  </Space>
);

const sortPapersByHeat = (papers) => {
  return papers.sort((paperA, paperB) => {
    const ratingA = paperA.ratings.length > 0 ? paperA.ratings.reduce((a, b) => a + b) / paperA.ratings.length : 0;
    const ratingB = paperB.ratings.length > 0 ? paperB.ratings.reduce((a, b) => a + b) / paperB.ratings.length : 0;
    const commentsA = paperA.comments.length;
    const commentsB = paperB.comments.length;

    if (ratingA === ratingB) {
      return commentsB - commentsA;
    } else {
      return ratingB - ratingA;
    }
  });
};

const PaperReview = () => {
  let history = useHistory();
  const [value, setValue] = useState('');
  const [rating, setRating] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleComment, setVisibleComment] = useState(false);
  const [visibleRate, setVisibleRate] = useState(false);
  const [activePaper, setActivePaper] = useState(null);
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7002/api/paper/search/detail/all')
      .then(res => {
        let res_ = res.data;
        const uniqueData = res_.reduce((unique, item) => {
          if (!unique.some(entry => entry.title === item.title)) {
            unique.push(item);
          }
          return unique;
        }, []);
        const fetchedPapers = uniqueData.map(paper => ({
          title: paper.title,
          author: paper.cite,
          content: paper.abstracts,
          ratings: paper.comments ? paper.comments.map(comment => comment.rating) : [],
          comments: paper.comments ? paper.comments.map(comment => comment.comment) : [],
        }));
        setPapers(fetchedPapers);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (val) => {
    setSearchTerm(val.toLowerCase());
  };

  const handleRate = (val) => {
    setRating(val);
  };

  const handleSubmitComment = () => {
    if (activePaper != null) {
      activePaper.comments.push(value);
      setValue('');
    }
    setVisibleComment(false);
  };

  const handleSubmitRating = () => {
    if (activePaper != null) {
      activePaper.ratings.push(rating);
      setRating(3);
    }
    setVisibleRate(false);
  };

  return (
    <div>
      <Search
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
        style={{width:"70%",marginLeft:"50%",transform:"translateX(-50%)"}}
        onSearch={handleSearch}
      />
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={sortPapersByHeat(papers.filter((paper) =>
          paper.title.toLowerCase().includes(searchTerm)
        ))}
        renderItem={(item) => (
          <List.Item
            key={item.title}
          >
            <Card
              title={item.title}
              extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
              actions={[
                <IconText
                  icon={StarOutlined}
                  text={item.ratings.length > 0 ? item.ratings.reduce((a, b) => a + b) / item.ratings.length : "No rating yet"}
                  key="list-vertical-star-o"
                  onClick={() => {setActivePaper(item); setVisibleRate(true)}}
                />,
                <IconText
                  icon={MessageOutlined}
                  text={item.comments.length}
                  key="list-vertical-message"
                  onClick={() => {
                    history.push("./two", { state: item.title });
                  }}
                />,
              ]}
            >
              {item.content}
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="Add Comment"
        centered
        visible={visibleComment}
        onOk={handleSubmitComment}
        onCancel={() => setVisibleComment(false)}
      >
        <Comment
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          }
          content={
            <Form.Item>
              <TextArea rows={4} onChange={(e) => setValue(e.target.value)} value={value} />
            </Form.Item>
          }
        />
      </Modal>
      <Modal
        title="Rate Paper"
        centered
        visible={visibleRate}
        onOk={handleSubmitRating}
        onCancel={() => setVisibleRate(false)}
      >
        <Rate value={rating} onChange={handleRate} />
      </Modal>
    </div>
  );
};

export default PaperReview;
