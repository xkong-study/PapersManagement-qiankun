import React, { useState, useEffect } from 'react';
import { List, Avatar, Rate, Typography, Card, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useParams } from 'react-router-dom';
const { Title } = Typography;

const UserPaperPage = () => {
  const { articleKey } = useParams();
  const [paper, setPaper] = useState(null);
  const [comments, setComments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  function checkLocalStorageItem(key) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      localStorage.getItem(key)
    } 
  }

// Call the function every 5 seconds
  setInterval(() => {
    checkLocalStorageItem('key');
  }, 5000); // 5000 milliseconds = 5 seconds



  useEffect(() => {
    // Fetch chart data and paper details from the API
    const fetchData = async () => {
      try {
        const [chartResponse, paperResponse] = await Promise.all([
          fetch(`http://localhost:7002/api/times/get/chart?title=${localStorage.getItem('key')}`),
          fetch(`http://localhost:7002/api/paper/search/detail?title=${localStorage.getItem('key')}&keyword=tag12`),
        ]);

        if (!chartResponse.ok || !paperResponse.ok) {
          throw new Error('Failed to fetch data.');
        }

        const [chartData, paperData] = await Promise.all([
          chartResponse.json(),
          paperResponse.json(),
        ]);

        // Update the state with fetched data
        setChartData(transformChartData(chartData));
        setPaper(paperData);
        setComments(paperData[0]?.comments || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [articleKey]);

  const transformChartData = (data) => {
    const { downloads, references, favorites } = data;
    const mergedData = { ...downloads, ...references, ...favorites };
    const uniqueMonths = Object.keys(mergedData);

    return uniqueMonths.map((month) => ({
      name: month,
      Downloads: downloads[month] || 0,
      References: references[month] || 0,
      Favorites: favorites[month] || 0,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Row justify="center">
      <Col xs={24} sm={22} md={22} lg={20} xl={20}>
        <Card style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title>{localStorage.getItem('key') || 'Paper Title'}</Title>
            <Rate value={paper?.avgRating || 0} disabled />
          </div>
          {chartData.length > 0 && (
            <LineChart
              width={800}
              height={300}
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 110,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Downloads" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="References" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Favorites" stroke="#ffc658" />
            </LineChart>
          )}
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} src={item.avatar} />}
                  title={<><span>{item.username}</span> <Rate value={item.rating} disabled /></>}
                  description={item.comment}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserPaperPage;
