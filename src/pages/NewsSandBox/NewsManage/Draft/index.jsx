/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:52:32
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 00:36:27
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, notification } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import classes from './index.module.scss';

const { confirm } = Modal;

const Draft = () => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const { username } = JSON.parse(localStorage.getItem('token'));
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b>{id}</b>,
    },
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
            danger
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => handleConfirm(item)}
          />
          <Button
            className={classes['editor-btn']}
            shape='circle'
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/news-manage/update/${item.id}`, { replace: false })
            }
          />
          <Button
            type='primary'
            shape='circle'
            icon={<UploadOutlined />}
            onClick={() => handleAudit(item)}
          />
        </>
      ),
    },
  ];

  const handleConfirm = (item) => {
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      cancelText: '取消',
      okText: '确定',
      maskClosable: false,
      onOk() {
        deleteNewsitem(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteNewsitem = (item) => {
    setDataSource((preDataSource) =>
      preDataSource.filter((el) => el.id !== item.id)
    );
    axios.delete(`/api/news/${item.id}`);
  };

  const handleAudit = (item) => {
    axios.patch(`/api/news/${item.id}`, { auditState: 1 }).then((res) => {
      navigate('/audit-manage/list', { replace: false });
      notification.info({
        message: '通知',
        description: '您可以到审核列表中查看您的新闻',
        placement: 'bottomRight',
      });
    });
  };

  useEffect(() => {
    axios
      .get(`/api/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        const list = res.data;
        setDataSource(list);
      });
  }, [username]);

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

export default Draft;
