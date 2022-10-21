/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 15:05:31
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-20 22:57:44
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import moment from 'moment';
import classes from './index.module.scss';

const NewsPreview = () => {
  const { id } = useParams();
  const [newsInfo, setNewsInfo] = useState(null);
  const auditList = ['未审核', '审核中', '已通过', '未通过'];
  const publishList = ['未发布', '待发布', '已上线', '已下线'];
  const colorList = ['black', 'orange', 'green', 'red'];
  useEffect(() => {
    axios.get(`/api/news/${id}?_expand=category&_expand=role`).then((res) => {
      setNewsInfo(res.data);
    });
  }, [id]);
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            className='site-page-header'
            onBack={() => window.history.back()}
            title={newsInfo?.title}
            subTitle={newsInfo?.category?.title}
          >
            <Descriptions>
              <Descriptions.Item label='创建者'>
                {newsInfo?.author}
              </Descriptions.Item>
              <Descriptions.Item label='创建时间'>
                {moment(newsInfo?.createTime).format('YYYY/MM/DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label='发布时间'>
                {newsInfo.publishTime
                  ? moment(newsInfo?.publishTime).format('YYYY/MM/DD HH:mm:ss')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label='区域'>
                {newsInfo?.region}
              </Descriptions.Item>
              <Descriptions.Item label='审核状态'>
                <span style={{ color: colorList[newsInfo?.auditState] }}>
                  {auditList[newsInfo?.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label='发布状态'>
                <span style={{ color: colorList[newsInfo?.publishState] }}>
                  {publishList[newsInfo?.publishState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label='访问数量'>
                <span style={{ color: 'yellowgreen' }}>{newsInfo?.view}</span>
              </Descriptions.Item>
              <Descriptions.Item label='点赞数量'>
                <span style={{ color: 'yellowgreen' }}>{newsInfo?.star}</span>
              </Descriptions.Item>
              <Descriptions.Item label='评论数量'>
                <span style={{ color: 'yellowgreen' }}>
                  {newsInfo?.comment}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo?.content,
            }}
            className={classes['news-content']}
          ></div>
        </div>
      )}
    </div>
  );
};

export default NewsPreview;
