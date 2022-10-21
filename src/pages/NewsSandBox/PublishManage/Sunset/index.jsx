/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 15:04:03
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 02:28:59
 * @Description:
 */
import React from 'react';
import { Button } from 'antd';
import NewsPublish from '../../../../components/publish-manage/NewsPublish';
import usePublishList from '../../../../hooks/usePublishList';

const Sunset = () => {
  const { dataSource, handleConfirm } = usePublishList(3);
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        handleBtn={(id) => (
          <Button danger onClick={() => handleConfirm(id)}>
            删除
          </Button>
        )}
      />
    </div>
  );
};

export default Sunset;
