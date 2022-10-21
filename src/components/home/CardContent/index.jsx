/*
 * @Author: {baixiao}
 * @Date: 2022-10-21 16:54:32
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 17:11:22
 * @Description:
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const CardContent = (props) => {
  const { title, list } = props;
  const navigate = useNavigate();
  return (
    <Card
      title={
        <>
          <span style={{ marginRight: '5px' }}>{title}</span>
          <BarChartOutlined />
        </>
      }
      bordered
      style={{ height: '100%' }}
    >
      <List
        size='small'
        bordered={false}
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <Button
              type='link'
              onClick={() =>
                navigate(`/news-manage/preview/${item.id}`, {
                  replace: false,
                })
              }
            >
              {item.title}
            </Button>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CardContent;
