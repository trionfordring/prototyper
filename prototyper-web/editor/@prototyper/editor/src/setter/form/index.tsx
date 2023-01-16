import { useSetterContext } from '@prototyper/core';
import { Button, Form } from 'antd';
import React, { FC, PropsWithChildren, useState } from 'react';
import styled from 'styled-components';

import { FormHeader } from './FormHeader';

import { NodeSetter } from '../node';

const RemoveButton = styled(Button)``;

export const SetterForm: FC<
  PropsWithChildren<{
    initialValues?: Record<string, any>;
  }>
> = ({ children, initialValues }) => {
  const { setProps, isRoot, deleteNode, selectedNode } = useSetterContext();
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
          <FormHeader title="Props配置">
            {selectedNode?.isDeletable ? (
              <RemoveButton
                type="default"
                danger
                size="small"
                onClick={deleteNode}
              >
                删除节点
              </RemoveButton>
            ) : null}
          </FormHeader>
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
