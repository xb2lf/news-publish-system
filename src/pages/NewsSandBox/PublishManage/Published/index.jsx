/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 14:59:45
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 02:29:08
 * @Description:
 */
import React from 'react';
import { Button } from 'antd';
import NewsPublish from '../../../../components/publish-manage/NewsPublish';
import usePublishList from '../../../../hooks/usePublishList';

const Published = () => {
  const { dataSource, handleSunset } = usePublishList(2);
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        handleBtn={(id) => (
          <Button danger onClick={() => handleSunset(id)}>
            下线
          </Button>
        )}
      />
    </div>
  );
};

export default Published;
