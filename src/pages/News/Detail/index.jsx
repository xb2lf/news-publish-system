/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 01:02:52
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 20:37:24
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  Descriptions,
  message,
  List,
  Form,
  Avatar,
  Input,
  Comment,
  Button,
} from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import classes from './index.module.scss';
import { updateId } from '../../../store/action-types';

const { TextArea } = Input;

const Detail = (props) => {
  const { Id, changeId } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsInfo, setNewsInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [currentList, setcurrentList] = useState([]);

  const { username, image } = JSON.parse(localStorage.getItem('visitor'));

  const handleStar = () => {
    const star = localStorage.getItem('star');
    if (!star) {
      setNewsInfo({
        ...newsInfo,
        star: newsInfo.star + 1,
      });

      axios.patch(`/news/${id}`, {
        star: newsInfo.star + 1,
      });
      localStorage.setItem('star', 1);
    } else {
      message.info('您已经点过赞了！');
    }
  };

  const handleSubmit = () => {
    if (!value) {
      return;
    } else if (!localStorage.getItem('visitor')) {
      message.info('请先登录！');
      setTimeout(() => {
        navigate('/visitor', { replace: false });
        changeId(id);
      }, 1000);
    }
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        ...comments,
        {
          author: [username],
          avatar: image,
          content: <p>{value}</p>,
          datetime: moment(Date.now()).format('YYYY/MM/DD HH:mm:ss'),
        },
      ]);
      setNewsInfo({
        ...newsInfo,
        comment: newsInfo.comment + 1,
      });
      axios.patch(`/news/${id}`, {
        comment: newsInfo.comment + 1,
      });
      setcurrentList({
        author: [username],
        avatar: image,
        content: value,
        datetime: moment(Date.now()).format('YYYY/MM/DD HH:mm:ss'),
        currentid: id,
      });
    }, 1000);
  };

  useEffect(() => {
    localStorage.removeItem('star');
    axios
      .get(`/api/news/${id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo({
          ...res.data,
          view: res.data.view + 1,
        });
        //同步后端
        return res.data;
      })
      .then((res) => {
        axios.patch(`/api/news/${id}`, {
          view: res.view + 1,
        });
      });
  }, [id]);

  useEffect(() => {
    axios.get(`/api/visitor?currentid=${id}`).then((res) => {
      setComments(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (Object.keys(currentList).length !== 0) {
      const { author, avatar, datetime, content, currentid } = currentList;
      axios
        .post(`/api/visitor`, {
          author,
          avatar,
          datetime,
          content,
          currentid,
        })
        .then((res) => {
          setcurrentList('');
        });
    }
  }, [currentList]);
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            className='site-page-header'
            onBack={() => window.history.back()}
            title={newsInfo?.title}
            subTitle={
              <div>
                {newsInfo?.category?.title}
                <HeartTwoTone
                  twoToneColor='#eb2f96'
                  onClick={() => handleStar()}
                  style={{ marginLeft: '5px' }}
                />
              </div>
            }
          >
            <Descriptions>
              <Descriptions.Item label='创建者'>
                {newsInfo?.author}
              </Descriptions.Item>
              <Descriptions.Item label='发布时间'>
                {newsInfo.publishTime
                  ? moment(newsInfo?.publishTime).format('YYYY/MM/DD HH:mm:ss')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label='区域'>
                {newsInfo?.region}
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
      <>
        {comments.length > 0 && (
          <List
            dataSource={Object.values(comments)}
            header={`${comments.length} ${
              comments.length > 1 ? 'replies' : 'reply'
            }`}
            itemLayout='horizontal'
            renderItem={(props) => <Comment {...props} />}
          />
        )}
        {image && (
          <Comment
            avatar={<Avatar src={image} alt={username} />}
            content={
              <>
                <Form.Item>
                  <TextArea
                    rows={4}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    value={value}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType='submit'
                    loading={submitting}
                    onClick={handleSubmit}
                    type='primary'
                  >
                    发表评论
                  </Button>
                </Form.Item>
              </>
            }
          />
        )}
      </>
    </div>
  );
};

const mapStateToProps = ({ newsDetailReducer }) => ({
  Id: newsDetailReducer.Id,
});

const mapDispatchToProps = {
  changeId: updateId,
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
