/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:24:29
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 04:46:47
 * @Description:
 */
import React, { useEffect } from 'react';
import { Layout } from 'antd';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import SideMenu from '../../components/SideMenu';
import TopHeader from '../../components/TopHeader';
import NewsRouter from '../../router/NewsRouter';
import './index.css';

const { Content } = Layout;

const NewsSandBox = () => {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Layout>
      <SideMenu />
      <Layout className='site-layout'>
        <TopHeader />
        <Content
          className='site-layout-background'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewsSandBox;
