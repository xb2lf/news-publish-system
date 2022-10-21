/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:50:31
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-20 00:06:45
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tree } from 'antd';
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './index.css';

const { confirm } = Modal;

const RoleList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b>{id}</b>,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
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
          <Button
            type='primary'
            shape='circle'
            icon={<UnorderedListOutlined />}
            onClick={() => handleShowModal(item)}
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
        deleteRightitem(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteRightitem = (item) => {
    setDataSource((preDataSource) =>
      preDataSource.filter((el) => el.id !== item.id)
    );
    axios.delete(`/api/roles/${item.id}`);
  };

  const handleShowModal = (item) => {
    setCurrentRights(item.rights);
    setCurrentId(item.id);
    setIsModalOpen(true);
  };

  const handleCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    setCurrentRights(checkedKeys.checked);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          };
        }
        return item;
      })
    );
    axios.patch(`/api/roles/${currentId}`, { rights: currentRights });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axios.get('/api/roles').then((res) => {
      setDataSource(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/rights?_embed=children').then((res) => {
      setRightList(res.data);
    });
  }, []);
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        rowKey={(item) => item.id}
      />
      <Modal
        title='权限分配'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={'取消'}
        okText={'确定'}
        maskClosable={false}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={handleCheck}
          treeData={rightList}
          checkStrictly={true}
        />
      </Modal>
    </div>
  );
};

export default RoleList;
