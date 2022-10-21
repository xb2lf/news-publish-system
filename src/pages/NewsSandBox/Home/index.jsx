/*
 * @Author: {baixiao}
 * @Date: 2022-10-19 00:47:08
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 18:56:49
 * @Description:
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Avatar, Drawer } from 'antd';
import {
  PieChartOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash';
import CardContent from '../../../components/home/CardContent';
import coverImg from '../../../assets/images/news.png';

const { Meta } = Card;

const Home = () => {
  const [viewList, setViewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [pieChart, setPieChart] = useState(null);
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const navigate = useNavigate();

  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem('token'));

  const renderBarView = (obj) => {
    var myChart = echarts.init(barRef.current);
    // 绘制图表
    myChart.setOption({
      title: {
        text: '新闻分类图示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    });
    window.onresize = () => {
      myChart.resize();
    };
  };

  const renderPieView = () => {
    var mychart;
    if (!pieChart) {
      mychart = echarts.init(pieRef.current);
      setPieChart(mychart);
    } else {
      mychart = pieChart;
    }
    const currentNewsList = newsList.filter((item) => item.author === username);
    const obj = _.groupBy(currentNewsList, (item) => item.category.title);
    const list = [];
    for (const i in obj) {
      if (Object.hasOwnProperty.call(obj, i)) {
        list.push({
          name: i,
          value: obj[i].length,
        });
      }
    }
    var option;
    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    option && mychart.setOption(option);
  };

  const handleShowPieChart = async () => {
    await setIsShow(true);
    renderPieView();
  };

  const handleClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    axios
      .get(
        '/api/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6'
      )
      .then((res) => {
        setViewList(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        '/api/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6'
      )
      .then((res) => {
        setstarList(res.data);
      });
  }, []);
  useEffect(() => {
    axios.get('/api/news?publishState=2&_expand=category').then((res) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title));
      setNewsList(res.data);
    });
    return () => {
      window.onresize = null;
    };
  }, []);
  return (
    <div className='site-card-wrapper'>
      <Row gutter={16}>
        <Col span={8}>
          <CardContent title='用户最常浏览' list={viewList} />
        </Col>
        <Col span={8}>
          <CardContent title='用户点赞最多' list={starList} />
        </Col>
        <Col span={8}>
          <Card
            bordered
            cover={<img alt='封面' src={coverImg} />}
            actions={[
              <PieChartOutlined key='pieChart' onClick={handleShowPieChart} />,
              <EditOutlined
                key='edit'
                onClick={() => {
                  navigate('/news-manage/add', { replace: false });
                }}
              />,
              <EllipsisOutlined key='ellipsis' />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
              }
              title={username}
              description={
                <>
                  <b style={{ marginRight: '30px', color: '#666666' }}>
                    {region === '' ? '全球' : region}
                  </b>
                  <span>{roleName}</span>
                </>
              }
            />
          </Card>
        </Col>
      </Row>
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: 400,
          marginTop: '30px',
        }}
      ></div>
      <Drawer
        width='500px'
        title='个人新闻数据分析'
        placement='right'
        closable={true}
        maskClosable={true}
        onClose={handleClose}
        open={isShow}
      >
        <div
          ref={pieRef}
          style={{ width: '100%', height: 400, marginTop: '30px' }}
        ></div>
      </Drawer>
    </div>
  );
};

export default Home;
