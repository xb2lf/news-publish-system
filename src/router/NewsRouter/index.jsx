/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 01:06:27
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 04:49:15
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import Home from '../../pages/NewsSandBox/Home';
import UserList from '../../pages/NewsSandBox/UserManage/UserList';
import RoleList from '../../pages/NewsSandBox/RightManage/Role/RoleList';
import RightList from '../../pages/NewsSandBox/RightManage/Right/RightList';
import NewsAdd from '../../pages/NewsSandBox/NewsManage/NewsAdd';
import Category from '../../pages/NewsSandBox/NewsManage/Category';
import Draft from '../../pages/NewsSandBox/NewsManage/Draft';
import NewsUpdate from '../../pages/NewsSandBox/NewsManage/Update';
import NewsPreview from '../../pages/NewsSandBox/NewsManage/Preview';
import Audit from '../../pages/NewsSandBox/AuditManage/Audit';
import AuditList from '../../pages/NewsSandBox/AuditManage/AuditList';
import Unpublished from '../../pages/NewsSandBox/PublishManage/Unpublished';
import Published from '../../pages/NewsSandBox/PublishManage/Published';
import Sunset from '../../pages/NewsSandBox/PublishManage/Sunset';
import PermissionDenied from '../../pages/NewsSandBox/PermissionDenied';

const LocalRouterMap = {
  '/home': <Home />,
  '/user-manage/list': <UserList />,
  '/right-manage/role/list': <RoleList />,
  '/right-manage/right/list': <RightList />,
  '/news-manage/add': <NewsAdd />,
  '/news-manage/draft': <Draft />,
  '/news-manage/category': <Category />,
  '/news-manage/update/:id': <NewsUpdate />,
  '/news-manage/preview/:id': <NewsPreview />,
  '/audit-manage/audit': <Audit />,
  '/audit-manage/list': <AuditList />,
  '/publish-manage/unpublished': <Unpublished />,
  '/publish-manage/published': <Published />,
  '/publish-manage/sunset': <Sunset />,
};

const NewsRouter = (props) => {
  const { isLoading } = props;
  const [backRouteList, setbackRouteList] = useState([]);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token'));

  const checkRoute = (item) =>
    LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson);

  const checkeUserPermission = (item) => rights.includes(item.key);

  useEffect(() => {
    Promise.all([axios.get('/api/rights'), axios.get('/api/children')])
      .then((res) => {
        setbackRouteList([...res[0].data, ...res[1].data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Spin side='large' spinning={isLoading}>
      <Routes>
        {backRouteList.map((item) => {
          if (checkRoute(item) && checkeUserPermission(item)) {
            return (
              <Route
                key={item.key}
                path={item.key}
                element={LocalRouterMap[item.key]}
                exact
              />
            );
          }
          return null;
        })}
        <Route path='/' element={<Navigate to='/home' />} exact />
        {backRouteList.length > 0 && (
          <Route path='*' element={<PermissionDenied />} />
        )}
      </Routes>
    </Spin>
  );
};

const mapStateToProps = ({ globalReducer }) => ({
  isLoading: globalReducer.isLoading,
});

export default connect(mapStateToProps)(NewsRouter);
