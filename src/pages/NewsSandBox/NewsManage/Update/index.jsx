/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 15:06:47
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-20 23:43:10
 * @Description:
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageHeader,
  Steps,
  Form,
  Input,
  Button,
  Select,
  message,
  notification,
} from 'antd';
import axios from 'axios';
import classes from './index.module.scss';
import NewsEditor from '../../../../components/news-manage/NewsEditor';

const { Step } = Steps;
const { Option } = Select;

const NewsUpdate = () => {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState('');
  const newsForm = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNext = () => {
    if (current === 0) {
      newsForm.current
        .validateFields()
        .then((values) => {
          setFormInfo(values);
          setCurrent(current + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空');
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleSave = (auditState) => {
    axios
      .patch(`/api/news/${id}`, {
        ...formInfo,
        content,
        auditState,
      })
      .then((res) => {
        const nextPath =
          auditState === 0 ? '/news-manage/draft' : '/audit-manage/list';
        openNotification('bottomRight', auditState);
        navigate(nextPath, { replace: false });
      });
  };

  const openNotification = (placement, auditState) => {
    notification.info({
      message: '通知',
      description: `您可以到${
        auditState === 0 ? '草稿箱' : '审核列表'
      }中查看您的新闻`,
      placement,
    });
  };

  useEffect(() => {
    axios.get('/api/categories').then((res) => {
      setCategoryList(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get(`/api/news/${id}?_expand=category&_expand=role`).then((res) => {
      const { title, categoryId, content } = res.data;
      newsForm.current.setFieldsValue({
        title,
        categoryId,
      });
      setContent(content);
    });
  }, [id]);
  return (
    <div>
      <PageHeader
        className='site-page-header'
        title='更新新闻'
        onBack={() => window.history.back()}
      />
      <Steps current={current}>
        <Step title='基本信息' description='新闻标题，新闻分类' />
        <Step title='新闻内容' description='新闻主体内容' />
        <Step title='新闻提交' description='保存草稿或者提交审核' />
      </Steps>
      <div className={classes['news-editor-main']}>
        <div className={current === 0 ? '' : classes.hidden}>
          <Form
            ref={newsForm}
            name='basic'
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
          >
            <Form.Item
              label='新闻标题'
              name='title'
              rules={[
                {
                  required: true,
                  message: '请输入新闻标题!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='新闻分类'
              name='categoryId'
              rules={[
                {
                  required: true,
                  message: '请选择新闻分类!',
                },
              ]}
            >
              <Select>
                {categoryList.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : classes.hidden}>
          <NewsEditor
            content={content}
            getContent={(value) => setContent(value)}
          />
        </div>
        <div className={current === 2 ? '' : classes.hidden}></div>
      </div>
      <div style={{ marginTop: '50px' }}>
        {current > 0 && <Button onClick={handlePrev}>上一步</Button>}
        {current < 2 && (
          <Button type='primary' onClick={handleNext}>
            下一步
          </Button>
        )}
        {current === 2 && (
          <span>
            <Button type='primary' onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
      </div>
    </div>
  );
};

export default NewsUpdate;
