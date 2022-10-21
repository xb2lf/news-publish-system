/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:51:25
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-19 22:54:42
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './index.css';

const { confirm } = Modal;

const RightList = () => {
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b>{id}</b>,
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => <Tag color='orange'>{key}</Tag>,
    },
    {
      title: '操作',
      render: (item) => (
        <>
          <Button
            className='del-btn'
            danger
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => handleConfirm(item)}
          />
          <Popover
            content={
              <div style={{ textAlign: 'center' }}>
                <Switch
                  checked={item.pagepermisson}
                  onChange={() => handleChange(item)}
                />
              </div>
            }
            title='页面配置项'
            trigger={item.pagepermisson === undefined ? '' : 'click'}
            placement='top'
            arrowPointAtCenter
          >
            <Button
              type='primary'
              shape='circle'
              icon={<EditOutlined />}
              disabled={item.pagepermisson === undefined}
            />
          </Popover>
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
        deleteRightitem(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteRightitem = (item) => {
    if (item.grade === 1) {
      setDataSource((preDataSource) =>
        preDataSource.filter((el) => el.id !== item.id)
      );
      axios.delete(`/api/rights/${item.id}`);
    } else {
      const list = dataSource.filter((el) => el.id === item.rightId);
      list[0].children.filter((el) => el.id !== item.rightId);
      setDataSource([...dataSource]);
      axios.delete(`/api/children/${item.id}`);
    }
  };

  const handleChange = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`/api/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/api/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };

  useEffect(() => {
    axios.get('/api/rights?_embed=children').then((res) => {
      const list = res.data;
      list.forEach((el) => {
        if (el.children.length === 0) {
          el.children = '';
        }
      });
      setDataSource(list);
    });
  }, []);
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        expandable={{ indentSize: 20 }}
        sticky={true}
      />
    </div>
  );
};

export default RightList;
