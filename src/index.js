/*
 * @Author: {baixiao}
 * @Date: 2022-10-18 23:36:11
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 15:48:24
 * @Description: 
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store';
import './index.css';
import App from './App';
import './utils/http';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Router>
);