import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { commonUtil } from 'qiankun-common';
import { useHistory } from 'react-router-dom';

const columns = [
  {
    title: 'Article Title',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <div onClick={() => {
      commonUtil.qiankunJump(`/api/childTwoMenu/pageSeven?key=${text}`)
      localStorage.setItem('key',text)
    }}>
      {text}
    </div>,
  },
  {
    title: 'Author',
    dataIndex: 'name',
    key: 'name',
    render: (name) => name.join(', '),
  },
  {
    title: 'Publication Date',
    dataIndex: 'date',
    key: 'date',
  },
];

const ArticlesPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Make the API call to fetch data
    fetch('http://localhost:7002/api/paper/search?searchTerm=' + localStorage.getItem('name'))
      .then((response) => response.json())
      .then((data) => {
        let uniqueData = data.reduce((unique, item) => {
          if (!unique.some(entry => entry.title === item.title) && item.name.includes(localStorage.getItem('name'))) {
            unique.push(item);
          }
          return unique;
        }, []);
        // Transform the data to match the table structure
        const transformedData = uniqueData.map((item, index) => ({
          key: index.toString(), // Use an index as the unique key for each row
          title: item.title,
          name: item.name,
          date: item.date,
        }));

        // Update the state with the retrieved data
        setData(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem' }}>
      <h1 style={{ color: '#1890ff', fontWeight: 'bold' }}>Article Upload</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ArticlesPage;
