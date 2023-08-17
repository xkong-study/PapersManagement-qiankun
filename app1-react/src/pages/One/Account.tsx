import React, { useEffect } from 'react';
import md5 from 'blueimp-md5';
import { Form, Input, Button, Divider } from 'antd';
import 'antd/dist/antd.css';


const userInfo = {
  loginName: 'John Doe',
};
const Account: React.FC = function () {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  async function handleUpdateUser() {
    try {
      const values = await form.validateFields();
      // 处理更新用户密码的逻辑
      console.log('Updated Password:', md5(values.password));
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    // 模拟异步获取用户配置数据
    const getUserConfig = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟延迟
      return {
        serverChanSckey: 'your-sckey', // 假数据，根据实际情况进行替换
      };
    };

    getUserConfig().then(res => {
      form2.setFieldsValue({
        sckey: res?.serverChanSckey || '',
      });
    });
  }, []);

  return (
    <div style={{marginLeft:"20px"}}>
      <Divider orientation="left" plain>Change Password</Divider>
      <Form layout="vertical" form={form} style={{ width: 300 }}>
        <Form.Item
          label="userName"
          name="name"
          initialValue={userInfo.loginName}
          rules={[
            { required: true, message: 'input userName' },
          ]}
        >
          <Input readOnly disabled />
        </Form.Item>

        <Form.Item
          label="newPassword"
          name="password"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { pattern: /.{6,}/, message: 'The new password must be at least 6 characters long' },
          ]}
        >
          <Input.Password maxLength={32} />
        </Form.Item>

        <br />

        <Form.Item>
          <Button type="primary" onClick={handleUpdateUser}>submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Account;

