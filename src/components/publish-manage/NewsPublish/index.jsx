/*
 * @Author: {baixiao}
 * @Date: 2022-10-21 01:25:00
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 02:29:21
 * @Description:
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'antd';

const NewsPublish = (props) => {
  const { dataSource, handleBtn } = props;
  const navigate = useNavigate();
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
      render: (item) => handleBtn(item.id),
    },
  ];

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

export default NewsPublish;
