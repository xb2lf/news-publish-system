/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 14:58:46
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 01:27:49
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, notification } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import classes from './index.module.scss';

const Audit = () => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem('token')
  );
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => (
        <Button
          type='link'
          onClick={() =>
            navigate(`/news-manage/preview/${item.id}`, { replace: false })
          }
        >
          {title}
        </Button>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.title,
    },
    {
      title: '操作',
      render: (item) => (
        <>
          <Button
            className={classes['audit-btn']}
            shape='circle'
            type='primary'
            icon={<CheckOutlined />}
            onClick={() => handleAudit(item, 2, 1)}
          />
          <Button
            danger
            shape='circle'
            type='primary'
            icon={<CloseOutlined />}
            onClick={() => handleAudit(item, 3, 0)}
          />
        </>
      ),
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    setDataSource((preDataSource) =>
      preDataSource.filter((el) => el.id !== item.id)
    );
    axios
      .patch(`/api/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: '通知',
          description: '您可以到[审核管理/审核列表]中查看您的新闻',
          placement: 'bottomRight',
        });
      });
  };

  useEffect(() => {
    const roleObj = {
      1: 'superadmin',
      2: 'admin',
      3: 'editor',
    };
    axios.get(`/api/news?&auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      setDataSource(
        roleObj[roleId] === 'superadmin'
          ? list
          : [
              ...list.filter((item) => item.author === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === 'editor'
              ),
            ]
      );
    });
  }, [roleId, region, username]);
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        rowKey={(item) => item.id}
      />
    </div>
  );
};

export default Audit;
