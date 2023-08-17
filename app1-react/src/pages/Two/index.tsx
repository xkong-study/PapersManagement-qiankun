import { Form, Input, Tabs, Card, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Search from "antd/es/input/Search";
import axios from 'axios';
import { commonUtil } from 'qiankun-common';
import "./index.less";

const cards = [
  { title: 'tag1', path: './pageFour' },
  { title: 'English', path: '#' },
  { title: 'Dissertation', path: '#' },
  { title: 'Math', path: '#' },
  { title: 'tag3', path: '#' },
  { title: 'tag3', path: '#' },
]

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
    render: (text:string) => <Link to={{pathname: './pageThree', state: {param1: text}}}>{text}</Link>
  },
  {
    title: 'Author',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Tags',
    key: 'source',
    dataIndex: 'source',
  },
  {
    title: 'Publication Date',
    key: 'date',
    dataIndex: 'date',
  },
];

const One = () => {
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const fetchCardData = async () => {
      const promises = cards.map(async card => {
        const response = await axios.get(`http://localhost:7002/api/paper/search?searchTerm=${card.title}`);
        let data = response.data;
        let uniqueData = data.reduce((unique, item) => {
          if (!unique.some(entry => entry.title === item.title)) {
            unique.push(item);
          }
          return unique;
        }, []);
        return { ...card, data: uniqueData };
      });
      const results = await Promise.all(promises);
      setCardData(results);
      console.log(results)
    };
    fetchCardData();
  }, []);


  const handleSearch = async value => {
    setSearchClicked(true);
    setSearchValue(value);
    const response = await axios.get(`http://localhost:7002/api/paper/search?searchTerm=${value}`);
    let uniqueData = response.data.reduce((unique, item) => {
      if (!unique.some(entry => entry.title === item.title)) {
        unique.push(item);
      }
      return unique;
    }, []);
    const results = uniqueData.map((item, index) => ({
      key: index + 1,
      title: item.title,
      name: item.name.join(', '),
      source: item.tags.join(', '),
      date: new Date(item.date).toISOString().split('T')[0],
    }));
    setTableData(results);
  };

  return (
    <div style={{width:"90%",marginLeft:"50%",transform:"translate(-50%,0)",height:"50rem"}}>
      <div className="divStyle">
        <div className="paper-index">
          <div className="search">
            <Search onSearch={handleSearch}></Search>
          </div>
        </div>
        <p style={{fontSize:"2em",marginLeft:"5px",color:"white",font:"bold"}}>Academic Focus</p>
        {searchClicked && searchValue ? (
          <Card>
            <p>Displaying search results for "{searchValue}"</p>
            <div className="box">
              <Table columns={columns} dataSource={tableData} />
            </div>
          </Card>
        ) : (
          <div className="box1">
            {cardData.map(card => (
              <Card title={card.title} extra={<Link to={{pathname: card.path, state: {param1: card.title}}}>More</Link>} className="card">
                {card.data.map((paper, index) => (
                  <div key={index} className="paper">
                    <Link to={{pathname: './pageThree', state: {param1: paper.title}}}>{paper.title}</Link>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default One;
