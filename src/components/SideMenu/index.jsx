/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 01:01:11
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 16:51:00
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  DiffOutlined,
  CheckCircleOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { connect } from 'react-redux';
import './index.css';
import { updateNavTitle } from '../../store/action-types';

const { Sider } = Layout;

const iconMap = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage': <TeamOutlined />,
  '/news-manage': <DiffOutlined />,
  '/audit-manage': <CheckCircleOutlined />,
  '/publish-manage': <SnippetsOutlined />,
};

const SideMenu = (props) => {
  const { isCollapsed, changeNavTitle } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [menuList, setMenu] = useState([]);

  const selectKeys = [location.pathname];
  const openKeys = [`/${location.pathname.split('/')[1]}`];

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'));

  const renderMenu = () => {
    return (
      menuList.length &&
      menuList.map((item) => {
        if (checkPagePermission(item)) {
          const newItem = { ...item, icon: iconMap[item.key] };
          if (item?.children.length) {
            return {
              ...newItem,
              children: item.children.map((el) => {
                if (checkPagePermission(el)) {
                  const newEl = { ...el };
                  delete newEl.rightId;
                  return newEl;
                }
              }),
            };
          } else {
            delete newItem.children;
            return newItem;
          }
        }
      })
    );
  };

  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key);
  };

  const handleClick = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    console.log(item.props.title);
    navigate(key, { replace: false });
    changeNavTitle(item.props.title);
  };

  useEffect(() => {
    axios.get('/api/rights?_embed=children').then((res) => {
      setMenu(res.data);
    });
  }, []);

  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
      <div className='side-menu'>
        <div className='logo'>全球新闻发布管理系统</div>
        <div className='menu-wrapper'>
          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={selectKeys}
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
            items={renderMenu()}
            onClick={handleClick}
          />
        </div>
      </div>
    </Sider>
  );
};

const mapStateToprops = ({ globalReducer }) => ({
  isCollapsed: globalReducer.isCollapsed,
});
const mapDispatchToProps = {
  changeNavTitle: updateNavTitle,
};

export default connect(mapStateToprops, mapDispatchToProps)(SideMenu);
