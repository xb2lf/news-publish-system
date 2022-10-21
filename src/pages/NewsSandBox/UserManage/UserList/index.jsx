/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:48:20
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 18:52:26
 * @Description:
 */
import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Switch } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './index.css';
import UserForm from '../../../../components/user-manage/UserForm';

const { confirm } = Modal;

const UserList = () => {
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem('token')
  );

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      filters: [
        ...regionList.map((item) => ({
          text: item.label,
          value: item.value,
        })),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === '';
        }
        return item.region === value;
      },
      render: (region) => <b>{region === '' ? '全球' : region}</b>,
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role.roleName,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户状态',
      render: (item) => (
        <Switch
          disabled={item.default}
          checked={item.roleState}
          onChange={() => handleChange(item)}
        />
      ),
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
            disabled={item.default}
            onClick={() => handleConfirm(item)}
          />
          <Button
            type='primary'
            shape='circle'
            icon={<EditOutlined />}
            disabled={item.default}
            onClick={() => handleOpenModal(item)}
          />
        </>
      ),
    },
  ];

  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`/api/users/${item.id}`, { roleState: item.roleState });
  };

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
    setDataSource(dataSource.filter((el) => el.id !== item.id));
    axios.delete(`/api/users/${item.id}`);
  };

  const handleShowModal = () => {
    setIsModalShow(true);
  };

  const handleOpenModal = async (item) => {
    await setIsModalOpen(true);
    if (item.roleId === 1) {
      setIsUpdateDisabled(true);
    } else {
      setIsUpdateDisabled(false);
    }
    updateForm.current.setFieldsValue(item);
    setCurrentUser(item);
  };

  const handleAddOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        setIsModalShow(false);
        addForm.current.resetFields();
        axios
          .post('/api/users', {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddCancel = () => {
    setIsModalShow(false);
  };
  const handleUpdateOk = () => {
    updateForm.current
      .validateFields()
      .then((value) => {
        setIsModalOpen(false);
        setDataSource(
          dataSource.map((item) => {
            if (item.id === currentUser.id) {
              return {
                ...item,
                ...value,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              };
            }
            return item;
          })
        );
        setIsUpdateDisabled(!isUpdateDisabled);
        axios.patch(`/api/users/${currentUser.id}`, value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateCancel = () => {
    setIsModalOpen(false);
    setIsUpdateDisabled(!isUpdateDisabled);
  };

  useEffect(() => {
    const roleObj = {
      1: 'superadmin',
      2: 'admin',
      3: 'editor',
    };
    axios.get('/api/users?_expand=role').then((res) => {
      const list = res.data;
      setDataSource(
        roleObj[roleId] === 'superadmin'
          ? list
          : [
              ...list.filter((item) => item.username === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === 'editor'
              ),
            ]
      );
    });
  }, [roleId, region, username]);
  useEffect(() => {
    axios.get('/api/roles').then((res) => {
      const list = res.data;
      setRoleList(list);
    });
  }, []);
  useEffect(() => {
    axios.get('/api/regions').then((res) => {
      const list = res.data;
      setRegionList(list);
    });
  }, []);
  return (
    <div>
      <Button type='primary' onClick={handleShowModal}>
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        rowKey={(item) => item.id}
      />
      <Modal
        title='添加用户'
        open={isModalShow}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        cancelText={'取消'}
        okText={'确定'}
        maskClosable={false}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList} />
      </Modal>
      <Modal
        title='更新用户'
        open={isModalOpen}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        cancelText={'取消'}
        okText={'确定'}
        maskClosable={false}
      >
        <UserForm
          ref={updateForm}
          regionList={regionList}
          roleList={roleList}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}
        />
      </Modal>
    </div>
  );
};

export default UserList;
