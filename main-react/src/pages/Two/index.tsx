import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Card, Comment, Avatar, Rate, List, Form, Button, Input, message } from 'antd';

const CommentItem = ({ username, rating, comment, avatar }) => {
  return (
    <Comment
      author={username}
      avatar={<Avatar src={avatar} alt={username} />}
      content={comment}
    >
      <Rate value={rating} disabled />
    </Comment>
  );
};

const PaperDetails = () => {
  const [paperData, setPaperData] = useState(null);
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(3);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { id } = useParams();
  const location = useLocation();
  console.log(location?.state?.state);

  const handleRatingChange = (value) => {
    setUserRating(value);
  };

  const handleCommentSubmit = async ({ comment, rate }) => {
    const newComment = {
      username: localStorage.getItem('name'),
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      rating: rate,
      comment: comment,
      title: localStorage.getItem('paper'),
    };

    try {
      const response = await fetch('http://localhost:7002/api/paper/search/add/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message);
        setPaperData({
          ...paperData,
          comments: [...paperData.comments, data.comment],
        });
        setUserComment('');
        setUserRating(3);
        form.resetFields();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Error adding comment.');
    }
  };

  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:7002/api/paper/search/detail?title=${localStorage.getItem('paper')}&keyword=tag12`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setPaperData(data[0]);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchPaperDetails();
  }, [location?.state?.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: Paper details not found.</div>;
  }

  const avgRating =
    paperData.comments?.reduce((acc, curr) => acc + curr.rating, 0) /
    paperData.comments?.length;

  return (
    <div>
      <Button onClick={goBack}>goBack</Button>
      <Card
        title={paperData.title}
        extra={<Rate value={avgRating} disabled />}
        style={{ width: '80%', margin: '2rem auto' }}
      >
        <Card>{paperData.abstracts}</Card>
        <h2 style={{ marginTop: '2rem' }}>Comments:</h2>
        <List
          dataSource={paperData.comments ?? []}
          renderItem={(item) => <CommentItem {...item} />}
        />
        <div style={{ marginTop: '2rem' }}>
          <Form form={form} onFinish={handleCommentSubmit}>
            <Form.Item
              name="comment"
              rules={[{ required: true, message: 'Please input your comment!' }]}
            >
              <TextArea
                rows={4}
                onChange={(e) => setUserComment(e.target.value)}
                value={userComment}
              />
            </Form.Item>
            <Form.Item name="rate">
              <Rate onChange={handleRatingChange} value={userRating} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Comment
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default PaperDetails;
