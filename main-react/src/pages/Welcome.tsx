import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import styles from './Welcome.less';
import PenelGroup from './PenelGroup.tsx'
import SystemInfo from './SystemInfo.tsx'
import AmountChart from './AmountChart.tsx'
import Login from '../pages/login/login.tsx'

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => {
  return (
    <div style={{margin:"5px"}}>
      <PenelGroup />
      <SystemInfo/>
      <AmountChart />
    </div>
  );
};
