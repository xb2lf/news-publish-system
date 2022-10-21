/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 01:01:44
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 18:35:55
 * @Description:
 */
import React from 'react';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { updateCollapsed } from '../../store/action-types';

const { Header } = Layout;

const TopHeader = (props) => {
  const { isCollapsed, navTitle, changeCollapsed } = props;
  const navigate = useNavigate();
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem('token'));
  const handleLogout = ({ key, item }) => {
    if (key === '2') {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  };
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: roleName,
        },
        {
          key: '2',
          label: '退出',
          danger: true,
        },
      ]}
      onClick={handleLogout}
    />
  );
  return (
    <Header
      className='site-layout-background'
      style={{
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        {isCollapsed ? (
          <MenuUnfoldOutlined onClick={() => changeCollapsed(false)} />
        ) : (
          <MenuFoldOutlined onClick={() => changeCollapsed(true)} />
        )}
        <span style={{ marginLeft: '20px', fontSize: '16px', fontWeight: 700 }}>
          {navTitle}
        </span>
      </div>
      <div>
        <span style={{ marginRight: '10px' }}>
          欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar
            size='large'
            src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

const mapStateToprops = ({ globalReducer }) => ({
  isCollapsed: globalReducer.isCollapsed,
  navTitle: globalReducer.navTitle,
});

const mapDispatchToProps = {
  changeCollapsed: updateCollapsed,
};

export default connect(mapStateToprops, mapDispatchToProps)(TopHeader);
