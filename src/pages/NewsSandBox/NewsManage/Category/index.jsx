/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:53:14
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 01:10:31
 * @Description:
 */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;

const Category = () => {
  const [dataSource, setDataSource] = useState([]);

  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className='editable-cell-value-wrap'
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b>{id}</b>,
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => (
        <>
          <Button
            danger
            shape='circle'
            icon={<DeleteOutlined />}
            onClick={() => handleConfirm(item)}
          />
        </>
      ),
    },
  ];

  const handleSave = (row) => {
    setDataSource((preDataSource) =>
      preDataSource.map((item) => {
        if (item.id === row.id) {
          return {
            id: item.id,
            title: row.title,
            value: row.title,
          };
        }
        return item;
      })
    );
    axios.patch(`/api/categories/${row.id}`, {
      title: row.title,
      value: row.title,
    });
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
        deleteNewsitem(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteNewsitem = (item) => {
    setDataSource((preDataSource) =>
      preDataSource.filter((el) => el.id !== item.id)
    );
    axios.delete(`/api/categories/${item.id}`);
  };
  useEffect(() => {
    axios.get(`/api/categories`).then((res) => {
      const list = res.data;
      setDataSource(list);
    });
  }, []);
  return (
    <div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        rowKey={(item) => item.id}
      />
    </div>
  );
};

export default Category;
