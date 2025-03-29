import React from 'react';
import { Menu, Button, Space } from 'antd';
import { 
  HomeOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">KejaHunt</Link>
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UploadOutlined />}>
          <Link to="/upload-listing">Post Listing</Link>
        </Menu.Item>
      </Menu>
      <div className="auth-buttons">
        <Space>
          <Button type="primary" icon={<UserOutlined />}>
            Login
          </Button>
          <Button>Register</Button>
        </Space>
      </div>
    </div>
  );
};

export default Navbar;