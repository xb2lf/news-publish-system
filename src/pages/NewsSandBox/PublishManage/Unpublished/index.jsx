/*
 * @Author: {baixiao}
 * @Date: 2022-10-20 15:03:21
 * @LastEditors: {baixiao}
 * @LastEditTime: 2022-10-21 02:28:45
 * @Description:
 */
import React from 'react';
import { Button } from 'antd';
import NewsPublish from '../../../../components/publish-manage/NewsPublish';
import usePublishList from '../../../../hooks/usePublishList';

const Unpublished = () => {
  const { dataSource, handlePublish } = usePublishList(1);
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        handleBtn={(id) => (
          <Button type='primary' onClick={() => handlePublish(id)}>
            发布
          </Button>
        )}
      />
    </div>
  );
};

export default Unpublished;
