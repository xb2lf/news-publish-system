/*
 * @Author: {baixiao}
 * @Date: 2022-10-21 01:44:45
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 02:40:45
 * @Description: 
 */
import { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;

const usePublishList = (publishState) => {
  const [dataSource, setDataSource] = useState([]);

  const { username } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios
      .get(`/api/news?author=${username}&publishState=${publishState}&_expand=category`)
      .then((res) => {
        const list = res.data;
        setDataSource(list);
      });
  }, [username, publishState]);

  const handlePublish = (id) => {
    setDataSource(preDataSource => preDataSource.filter(item => item.id !== id));
    axios.patch(`/api/news/${id}`, { publishState: 2, publishTime: Date.now() }).then(res => {
      notification.info({
        message: '通知',
        description: '您可以到[发布管理/已发布]中查看您的新闻',
        placement: 'bottomRight',
      });
    })
  };

  const handleSunset = (id) => {
    setDataSource(preDataSource => preDataSource.filter(item => item.id !== id));
    axios.patch(`/api/news/${id}`, { publishState: 3 }).then(res => {
      notification.info({
        message: '通知',
        description: '您可以到[发布管理/已下线]中查看您的新闻',
        placement: 'bottomRight',
      });
    })
  };

  const handleConfirm = (id) => {
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      cancelText: '取消',
      okText: '确定',
      maskClosable: false,
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDelete = (id) => {
    setDataSource(preDataSource => preDataSource.filter(item => item.id !== id));
    axios.delete(`/api/news/${id}`).then(res => {
      notification.info({
        message: '通知',
        description: '您已经删除了已下线的新闻',
        placement: 'bottomRight',
      });
    })
  };
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleConfirm,
  };
};



export default usePublishList