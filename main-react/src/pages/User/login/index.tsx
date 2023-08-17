import { LockOutlined,UserOutlined,CameraOutlined,MailOutlined,IdcardOutlined,TeamOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { LoginParamsType } from '@/services/login';
import { StateType } from '@/models/login';
import { FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import { Card, Tabs, Alert, message, Upload, Avatar, Tooltip, Button } from 'antd';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { getFakeCaptcha } from '@/services/login';
import React, { useState } from 'react';
import styles from './index.less';
import type { ConnectState } from '@/models/connect';
import { useHistory } from 'react-router-dom';


export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
};

const LoginMessage: React.FC<{ content: string; }> = ({ content }) => (
  <Alert style={{ marginBottom: 24, }} message={content} type="error" showIcon />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState<string>('account');
  const [avatar, setAvatar] = useState('');
  let history = useHistory()

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    if (type === 'account') {
      // dispatch({
      //   type: 'login/login',
      //   payload: {...values, type},
      // });
      history.push('../api')
    }
    else if (type === 'mobile') {
      dispatch({
        type: 'login/register',
        payload: {
          ...values,
          avatar: avatar,
          type,
          role: 'user',
          status: 'inactive',
          token: 'abcd1234',
          registerTime: new Date().toISOString(),
          timeZone: 'UTC+1',
        },
      });
    }
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
    return false;
  };

  const uploadButton = (
    <Tooltip title="更换头像">
      <Button icon={<CameraOutlined />} />
    </Tooltip>
  );

  return (
    <div className={styles.login}>
      <Card className="login-card" hoverable>
        <ProForm
          initialValues={{ autoLogin: true, }}
          submitter={{
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              style: { width: '100%', },
            },
          }}
          onFinish={(values) => {
            localStorage.setItem('name', values.userName);
            handleSubmit(values as LoginParamsType);
            return Promise.resolve();
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab="Account password login" />
            <Tabs.TabPane key="mobile" tab="Account password register" />
          </Tabs>
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="Incorrect account or password（admin/ant.design)" />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{ size: 'large', prefix: <UserOutlined className={styles.prefixIcon} />, }}
                placeholder="Username: admin or user"
                rules={[{ required: true, message: "Please enter user name!" }]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{ size: 'large', prefix: <LockOutlined className={styles.prefixIcon} />, }}
                placeholder="Password: ant.design"
                rules={[{ required: true, message: "Please enter password！" }]}
              />
              <div style={{ marginBottom: 24, }}>
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" defaultMessage="Auto login" />
                </ProFormCheckbox>
                <a style={{ float: 'right', }}>
                  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="Forget password" />
                </a>
              </div>
            </>
          )}
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="Verification code error" />
          )}
          {type === 'mobile' && (
            <>
              <div className="avatar-upload">
                <Avatar src={avatar} size={64} icon={<UserOutlined />} style={{marginLeft:"50%",transform:"translate(-50%,0)",marginBottom:"15px"}}/>
                <Upload name="avatar" beforeUpload={beforeUpload} showUploadList={false}>
                  {uploadButton}
                </Upload>
              </div>
              <ProFormText
                name="email"
                fieldProps={{ size: 'large', prefix: <MailOutlined className={styles.prefixIcon} />, }}
                placeholder="Email"
                rules={[{ required: true, message: "Please enter email!" }]}
              />
              <ProFormText
                name="userName"
                fieldProps={{ size: 'large', prefix: <UserOutlined className={styles.prefixIcon} />, }}
                placeholder="Username"
                rules={[{ required: true, message: "Please enter user name!" }]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{ size: 'large', prefix: <LockOutlined className={styles.prefixIcon} />, }}
                placeholder="Password"
                rules={[{ required: true, message: "Please enter password！" }]}
              />
              <ProFormText
                name="signature"
                fieldProps={{ size: 'large', prefix: <IdcardOutlined className={styles.prefixIcon} />, }}
                placeholder="Signature"
                rules={[{ required: true, message: "Please enter signature!" }]}
              />
            </>
          )}
        </ProForm>
      </Card>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submittingLogin: loading.effects['login/login'] || false,
  submittingRegister: loading.effects['login/register'] || false,
}))(Login);
