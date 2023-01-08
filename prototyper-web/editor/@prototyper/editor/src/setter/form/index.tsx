import { useSetterContext } from '@prototyper/core';
import { Button, Form, Typography } from 'antd';
import React, { FC, PropsWithChildren, useState } from 'react';

import { NodeSetter } from '../node';

export const SetterForm: FC<
  PropsWithChildren<{
    initialValues?: Record<string, any>;
  }>
> = ({ children, initialValues }) => {
  const { setProps, isRoot } = useSetterContext();
  const [changed, setChanged] = useState(false);
  const onFinish = (values: any) => {
    setProps(values);
    setChanged(false);
  };
  return (
    <React.Fragment>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        onFinish={onFinish}
        onValuesChange={() => setChanged(true)}
      >
        {isRoot ? null : (
          <Form.Item>
            <Typography>
              <Typography.Text>Props配置</Typography.Text>
            </Typography>
          </Form.Item>
        )}
        {children}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type={changed ? 'primary' : 'dashed'} htmlType="submit">
            {changed ? '提交修改' : '确定'}
          </Button>
        </Form.Item>
      </Form>
      {isRoot ? null : <NodeSetter></NodeSetter>}
    </React.Fragment>
  );
};
