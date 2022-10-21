/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 14:58:17
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 04:57:25
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, notification } from 'antd';
import axios from 'axios';

const AuditList = () => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const { username } = JSON.parse(localStorage.getItem('token'));
  const auditList = ['未审核', '审核中', '已通过', '未通过'];
  const colorList = ['black', 'orange', 'green', 'red'];
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
      title: '审核状态',
      dataIndex: 'auditState',
      key: 'auditState',
      render: (auditState) => (
        <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      ),
    },
    {
      title: '操作',
      render: (item) => (
        <>
          {item.auditState === 1 && (
            <Button onClick={() => handleRervert(item)}>撤销</Button>
          )}
          {item.auditState === 2 && (
            <Button danger onClick={() => handlePublish(item)}>
              发布
            </Button>
          )}
          {item.auditState === 3 && (
            <Button type='primary' onClick={() => handleUpdate(item)}>
              更新
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleRervert = (item) => {
    setDataSource((preDataSource) =>
      preDataSource.filter((el) => el.id !== item.id)
    );
    axios.patch(`/api/news/${item.id}`, { auditState: 0 }).then((res) => {
      notification.info({
        message: '通知',
        description: '您可以到草稿箱中查看您的新闻',
        placement: 'bottomRight',
      });
    });
  };

  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`, { replace: false });
  };

  const handlePublish = (item) => {
    axios
      .patch(`/api/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: '通知',
          description: '您可以到[发布管理/已发布]中查看您的新闻',
          placement: 'bottomRight',
        });
        navigate('/publish-manage/published', { replace: false });
      });
  };

  useEffect(() => {
    axios
      .get(
        `/api/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
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

export default AuditList;
