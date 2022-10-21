/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:46:11
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 20:41:37
 * @Description:
 */
import React, { useRef } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { connect } from 'react-redux';
import classes from './index.module.scss';

const particlesInit = async (main) => {
  await loadFull(main);
};

const Visitors = (props) => {
  const { Id } = props;
  const navigate = useNavigate();
  const value = useRef(null);
  //登录
  const onFinish = (value) => {
    //头像
    const image = [
      'https://joeschmoe.io/api/v1/jean',
      'https://joeschmoe.io/api/v1/james',
      'https://joeschmoe.io/api/v1/jack',
      'https://joeschmoe.io/api/v1/josh',
      'https://joeschmoe.io/api/v1/jordan',
      'https://joeschmoe.io/api/v1/jodi',
      'https://joeschmoe.io/api/v1/julie',
      'https://joeschmoe.io/api/v1/jeri',
    ];
    const index = Math.floor(Math.random() * image.length);
    const obj = { image: image[index] };

    axios
      .get(
        `/api/visitors?username=${value.username}&password=${value.password}`
      )
      .then((res) => {
        if (res.data.length === 0) {
          message.error('用户名或密码不匹配');
        } else {
          if (Object.keys(obj).length !== 0) {
            const list = { ...value, ...obj };
            localStorage.setItem('visitor', JSON.stringify(list));
            navigate(`/detail/${Id}`);
          }
        }
      });
  };
  //注册
  const enroll = () => {
    value.current.validateFields().then((res) => {
      axios
        .post('/api/visitors', {
          ...res,
        })
        .then((res) => {
          localStorage.setItem('visitor', JSON.stringify(res.data));
          message.success('注册成功');
        });
    });
  };
  //粒子参数
  const options = {
    background: {
      color: {
        value: '#232741',
      },
      position: '50% 50%',
      repeat: 'no-repeat',
      size: 'cover',
    },
    // 帧数，越低越卡,默认60
    fpsLimit: 120,
    fullScreen: {
      zIndex: 1,
    },
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'slow',
        },
      },
      modes: {
        push: {
          //点击是添加1个粒子
          quantity: 3,
        },
        bubble: {
          distance: 200,
          duration: 2,
          opacity: 0.8,
          size: 20,
          divs: {
            distance: 200,
            duration: 0.4,
            mix: false,
            selectors: [],
          },
        },
        grab: {
          distance: 400,
        },
        //击退
        repulse: {
          divs: {
            //鼠标移动时排斥粒子的距离
            distance: 200,
            //翻译是持续时间
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: 'ease-out-quad',
            selectors: [],
          },
        },
        //缓慢移动
        slow: {
          //移动速度
          factor: 2,
          //影响范围
          radius: 200,
        },
        //吸引
        attract: {
          distance: 200,
          duration: 0.4,
          easing: 'ease-out-quad',
          factor: 3,
          maxSpeed: 50,
          speed: 1,
        },
      },
    },
    //  粒子的参数
    particles: {
      //粒子的颜色
      color: {
        value: '#ffffff',
      },
      //是否启动粒子碰撞
      collisions: {
        enable: true,
      },
      //粒子之间的线的参数
      links: {
        color: {
          value: '#ffffff',
        },
        distance: 150,
        enable: true,
        warp: true,
      },
      move: {
        attract: {
          rotate: {
            x: 600,
            y: 1200,
          },
        },
        enable: true,
        outModes: {
          bottom: 'out',
          left: 'out',
          right: 'out',
          top: 'out',
        },
        speed: 6,
        warp: true,
      },
      number: {
        density: {
          enable: true,
        },
        //初始粒子数
        value: 40,
      },
      //透明度
      opacity: {
        value: 0.5,
        animation: {
          speed: 3,
          minimumValue: 0.1,
        },
      },

      //大小
      size: {
        random: {
          enable: true,
        },
        value: {
          min: 1,
          max: 3,
        },
        animation: {
          speed: 20,
          minimumValue: 0.1,
        },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: 'rgb(35, 39, 65)',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Particles id='tsparticles' init={particlesInit} options={options} />

      <div className={classes.formContainer}>
        <div className={classes.logintitle}>全球新闻游客系统</div>
        <Form
          name='normal_login'
          className='login-form'
          onFinish={onFinish}
          ref={value}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Username'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <Button
          type='primary'
          htmlType='submit'
          className='login-form-button'
          onClick={() => enroll()}
        >
          注册
        </Button>
      </div>
    </div>
  );
};
const mapStateToProps = ({ newsDetailReducer }) => ({
  Id: newsDetailReducer.Id,
});

export default connect(mapStateToProps)(Visitors);
