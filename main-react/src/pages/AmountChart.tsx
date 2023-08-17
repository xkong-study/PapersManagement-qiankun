import React, { useEffect, useState } from 'react';
import './Welcome.less';
import { Empty, DatePicker } from 'antd';
import {
  LineChart, Line, XAxis,
  YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart,
  Bar
} from 'recharts';

type DataProp = {
  date: string
  [key: string]: any
}

interface GroupProp {
  amount: string
  name: string
  type: number
  [key: string]: any
}

const { RangePicker } = DatePicker

const AmountChart = () => {
  const [data, setData] = useState<DataProp[]>([]);
  const [date, setDate] = useState<any>();
  const [group, setGroup] = useState<GroupProp[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  useEffect(() => {

    const fetchLineChartData = async () => {
      const author = localStorage.getItem("name");
      if (!author) {
        console.error("No author found in localStorage");
        return;
      }

      const monthMapping = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }; // Add more if needed

      try {
        const res = await fetch(`http://localhost:7002/api/times/get/all?author=${author}`);
        const data = await res.json();

        let combinedData = [];

        const addData = (key, type, value) => {
          const existing = combinedData.find(item => item.date === key);
          if (existing) {
            existing[type] = value;
          } else {
            combinedData.push({ date: key, [type]: value });
          }
        }

        for (let key in data.references) {
          addData(key, 'Citations', data.references[key]);
        }

        for (let key in data.downloads) {
          addData(key, 'Download num', data.downloads[key]);
        }

        for (let key in data.favorites) {
          addData(key, 'Favorites num', data.favorites[key]);
        }

        // Sort data by date
        combinedData.sort((a, b) => monthMapping[a.date] - monthMapping[b.date]);

        setData(combinedData);
        setTotalAmount(combinedData.reduce((sum, item) => sum + (item.Citations || 0) + (item['Download num'] || 0) + (item['Favorites num'] || 0), 0));

      }catch (error) {
        console.log(error);
      }
    };

    const fetchPapersData = async () => {
      const author = localStorage.getItem("name");
      if (!author) {
        console.error("No author found in localStorage");
        return;
      }
      try {
        const res = await fetch(`http://localhost:7002/api/paper/search?searchTerm=${author}`);
        const data = await res.json();

        const titles = data.map((paper: { title: string }) => paper.title);
        const paperData = await Promise.all(
          titles.map(async (title) => {
            const response = await fetch(`http://localhost:7002/api/times/get/chart?title=${title}`);
            const paperStats = await response.json();

            return {
              name: title,
              downloads: Object.values(paperStats.downloads).reduce((a, b) => a + b, 0),
              references: Object.values(paperStats.references).reduce((a, b) => a + b, 0),
              favorites: Object.values(paperStats.favorites).reduce((a, b) => a + b, 0),
            };
          })
        );

        setGroup(paperData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLineChartData();
    fetchPapersData();
  }, []);

  return (
    <div className="amount-chart">
      <h2 className="title">
        Data Management Center
        <RangePicker
          value={date}
          className="date-picker"
        />
      </h2>

      {(totalAmount > 0) ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Citations" stroke="#82ca9d" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Download num" stroke="#ff5000" />
            <Line type="monotone" dataKey="Favorites num" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="no-data">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      {group.length > 0 && (
        <ResponsiveContainer width="100%" height={350} className="mt10">
          <BarChart
            width={500}
            height={300}
            data={group}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey={selectedTitle ? selectedTitle : "downloads"} name="downloads" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
};

export default AmountChart;
