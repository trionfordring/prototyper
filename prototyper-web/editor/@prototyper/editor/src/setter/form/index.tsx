import { useSetterContext } from '@prototyper/core';
import { Button, Form } from 'antd';
import React, {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  useState,
} from 'react';
import styled from 'styled-components';

import { FormHeader } from './FormHeader';

import { NodeSetter } from '../node';

const RemoveButton = styled(Button)``;

export const SetterForm: FC<
  PropsWithChildren<
    ComponentPropsWithRef<typeof Form> & {
      initialValues?: Record<string, any>;
    }
  >
> = ({ children, initialValues, ...props }) => {
  const { setProps, isRoot, deleteNode, selectedNode } = useSetterContext();
  const [changed, setChanged] = useState(false);
  const onFinish = ({ propsMapper: mapper, ...props }: any) => {
    const propsMapper = {};
    Object.keys(mapper || {}).forEach((k) => {
      if (mapper[k]) propsMapper[k] = mapper[k];
    });
    console.log('setProps', props, propsMapper);
    setProps(props, propsMapper);
    setChanged(false);
  };
  return (
    <React.Fragment>
      {children ? (
        <Form
          labelAlign="left"
          labelWrap
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={initialValues}
          onFinish={onFinish}
          onValuesChange={() => setChanged(true)}
          size="small"
          {...props}
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
      ) : null}
      {isRoot ? null : <NodeSetter></NodeSetter>}
    </React.Fragment>
  );
};

export { FormItem } from './FormItem';
export { FormHeader } from './FormHeader';
