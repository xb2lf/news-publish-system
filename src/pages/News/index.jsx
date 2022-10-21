/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:46:31
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 20:23:46
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Col, Row, List, Button } from 'antd';
import axios from 'axios';
import _ from 'lodash';

const News = () => {
  const [list, setlist] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`/api/news?publishState=2&_expand=category`).then((res) => {
      setlist(
        Object.entries(_.groupBy(res.data, (item) => item.category.title))
      );
    });
  }, []);
  return (
    <div
      style={{
        width: '95%',
        margin: '0 auto',
      }}
    >
      <PageHeader
        className='site-page-header'
        title='全球大新闻'
        subTitle='查看新闻'
      />
      <div className='site-card-wrapper'>
        <Row gutter={[16, 16]}>
          {list.map((item) => (
            <Col span={8} key={item[0]}>
              <Card title={item[0]} bordered={true} hoverable={true}>
                <List
                  size='small'
                  dataSource={item[1]}
                  pagination={{
                    pageSize: 2,
                  }}
                  renderItem={(el) => (
                    <List.Item>
                      <Button
                        type='link'
                        onClick={() =>
                          navigate(`/detail/${el.id}`, { replace: false })
                        }
                      >
                        {el.title}
                      </Button>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default News;
