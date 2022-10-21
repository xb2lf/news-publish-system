/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:15:04
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 19:13:23
 * @Description: 
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import NewsSandBox from '../pages/NewsSandBox';
import News from '../pages/News';
import Visitors from '../pages/Visitors';
import Detail from '../pages/News/Detail';
/* import NotFound from '../pages/NotFound'; */

const IndexRouter = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/news' element={<News />}></Route>
      <Route path='/visitor' element={<Visitors />}></Route>
      <Route path='/detail/:id' element={<Detail />}></Route>
      <Route path='/*' element={<AuthComponent>
        <NewsSandBox></NewsSandBox>
      </AuthComponent>} />
    </Routes>
  );
};

// 路由拦截组件的封装
function AuthComponent({ children }) {
  const islogin = localStorage.getItem("token");
  return islogin ? children : <Navigate to='/login' />
}

export default IndexRouter;