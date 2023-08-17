// @ts-ignore
import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Statistic } from 'antd'
import { Card } from 'antd';
import './PenelGroup.less'
import {
  CopyOutlined,
  ScheduleFilled,
  FileTextFilled,
  AlertFilled
} from '@ant-design/icons'
import axios from 'axios';

import { Link } from 'react-router-dom';

const PanelGroup = () => {
  const isInit = useRef<boolean>(false);
  const [data, setData] = useState([]);
  const [state, setState] = useState([
    {
      title: 'Published Number',
      total: '0',
      Icon: <CopyOutlined className="icon" />,
      path: './childTwoMenu/pageSix'
    },
    {
      title: 'To-do list',
      total: '0',
      Icon: <ScheduleFilled className="icon" />,
      path: './childTwoPageFour'
    },
    {
      title: 'Project overview',
      total: '0',
      Icon: <FileTextFilled className="icon" />,
      path: './childOneMenu/pageTwo'
    },
    {
      title: 'Upload',
      total: '0',
      Icon: <AlertFilled className="icon" />,
      path: './childTwoMenu/pageFive'
    },
  ]);

  let name = localStorage.getItem("name");
  console.log(name)
  useEffect(async() => {
    // replace with your actual API endpoint
    await axios.get('http://localhost:7002/api/paper/search?searchTerm=' + name)
      .then(res => res.data)
      .then(res => {
        const fetchedData = res.map((item, index) => ({
          key: index + 1,
          title: item.title,
          name: item.name.join(', '),
          date: item.date,
          tags: item.tags,
        }));
        setState(state => {
          return state.map(item => {
            if (item.title === 'Upload') {
              return {
                ...item,
                total: fetchedData.length
              }
            }
            if(item.title === 'Published Number') {
              return {
                ...item,
                total: fetchedData.length
              }
            }
            return item;
          })
        })
      })
      .catch(err => console.log(err));
    await axios.get('http://localhost:7003/api/tasks/get?username=' + name)
      .then(res => res.data)
      .then(res=> {
        setState(state => {
          return state.map(item => {
            if (item.title === 'To-do list') {
              return {
                ...item,
                total: res.length
              }
            }
            return item;
          })
        })
      })
    await axios.get('http://localhost:7002/api/paper/search/detail/all')
      .then(res => res.data)
      .then(res => {
        const uniqueData = res.reduce((unique, item) => {
          if (!unique.some(entry => entry.title === item.title)) {
            unique.push(item);
          }
          return unique;
        }, []);
        setState(state => {
          return state.map(item => {
            if (item.title === 'Project overview') {
              return {
                ...item,
                total: uniqueData.length
              }
            }
            return item;
          })
        })
      })
  }, [name]);

  useEffect(() => {console.log(data)}, [data]);

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24 }} className="panel-group" style={{ marginLeft: "5px" }}>
      {state.map(item => (
        <Col xl={6} lg={12} md={12} sm={24} xs={24} key={item.title}>
          <Link to={item.path}>
            <Card hoverable>
              {item.Icon}
              <div className="data">
                <Statistic title={item.title} value={item.total} prefix={item?.prefix} />
              </div>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default PanelGroup;

