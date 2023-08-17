import { Card, Space,Table, Tag, Button } from 'antd';
import { commonUtil } from 'qiankun-common';
import { Route } from 'umi';
import { useHistory, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import "./index.less";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const One = () => {
  const [data, setData] = useState([]);
  let item = localStorage.getItem("state");
  const location = useLocation();
  const history = useHistory();

  if(location.state && location.state.param1) {
    item = location.state.param1;
  }

  console.log(item)

  useEffect(() => {
    // replace with your actual API endpoint
    axios.get('http://localhost:7002/api/paper/search?searchTerm=' + item)
      .then(res => {
        const fetchedData = res.data.map((item, index) => ({
          key: index + 1,
          title: item.title,
          name: item.name.join(', '),
          date: item.date,
          tags: item.tags,
        }));
        let fetchedData2 = fetchedData;
        const uniqueData = fetchedData2.reduce((unique, item) => {
          if (!unique.some(entry => entry.title === item.title)) {
            unique.push(item);
          }
          return unique;
        }, []);
        setData(uniqueData);
      })
      .catch(err => console.log(err));
  }, [item]);

  const goBack = () => {
    history.goBack();
  }

  const Jump=(text)=>{
    localStorage.setItem("jump",text)
    commonUtil.qiankunJump(`http://localhost:5001/api/childOneMenu/pageThree`)
  }
  const columns = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <a
          className="font"
          onClick={() => Jump(text)}
        >
          {text}
        </a>
      )
    },
    {
      title: 'Author',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <>
          {tags.map(tag => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Publication Date',
      key: 'date',
      dataIndex: 'date',
    },
  ]

  return (
    <div style={{width: "90%", marginLeft: "50%", height: "60rem", transform: "translate(-50%,0)"}}>
      <Button onClick={goBack}>goBack</Button>
      <div className="divStyle">
        <p style={{fontSize: "2em", marginLeft: "5px", color: "black"}}>Academic Focus</p>
        <div className="box">
          <Card title={item} className="card">
            <Table columns={columns} dataSource={data} />
          </Card>
        </div>
      </div>
    </div>
  )
}
export default One
