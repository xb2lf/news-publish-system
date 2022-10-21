/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 23:19:00
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-20 14:49:01
 * @Description:
 */
import React, { useState, forwardRef, useEffect } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
  const { regionList, roleList, isUpdate } = props;
  const [isDisabled, setIsDisabled] = useState(false);

  const { roleId, region } = JSON.parse(localStorage.getItem('token'));

  const roleObj = {
    1: 'superadmin',
    2: 'admin',
    3: 'editor',
  };

  const handleRoleChange = (value) => {
    if (value === 1) {
      setIsDisabled(true);
      ref.current.setFieldsValue({
        region: '',
      });
    } else {
      setIsDisabled(false);
    }
  };

  const checkeRegionDisabled = (item) => {
    if (isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false;
      } else {
        return item.value !== region;
      }
    }
  };

  const checkeRoleDisabled = (item) => {
    if (isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false;
      } else {
        return roleObj[item.id] !== 'editor';
      }
    }
  };

  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);
  return (
    <Form ref={ref} layout='vertical' name='form_in_modal' initialValues={{}}>
      <Form.Item
        name='username'
        label='用户名'
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='password'
        label='密码'
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input type='password' autoComplete='off' />
      </Form.Item>
      <Form.Item
        name='region'
        label='区域'
        rules={isDisabled ? [] : [{ required: true, message: '请选择区域!' }]}
      >
        <Select disabled={isDisabled}>
          {regionList.map((item) => (
            <Option
              disabled={checkeRegionDisabled(item)}
              key={item.id}
              value={item.value}
            >
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='roleId'
        label='角色'
        rules={[{ required: true, message: '请选择角色!' }]}
      >
        <Select onChange={handleRoleChange}>
          {roleList.map((item) => (
            <Option
              disabled={checkeRoleDisabled(item)}
              key={item.id}
              value={item.id}
            >
              {item.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;
