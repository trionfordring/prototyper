import { useNode } from '@prototyper/core';
import { Button, Form } from 'antd';
import React, { FC, PropsWithChildren } from 'react';

export interface SetterContextType {
  virtualMode: boolean;
}

export const SetterContext = React.createContext<SetterContextType>({
  virtualMode: false,
});

export const SetterForm: FC<
  PropsWithChildren<{
    initialValues?: Record<string, any>;
    virtualMode?: boolean;
  }>
> = ({ children, initialValues, virtualMode }) => {
  const {
    actions: { setProp },
  } = useNode();
  const onFinish = (values: any) => {
    setProp((props) => {
      if (virtualMode)
        Object.assign(props, {
          props: values,
        });
      else Object.assign(props, values);
      console.log('set props:', values);
    });
  };
  return (
    <SetterContext.Provider
      value={{
        virtualMode: virtualMode,
      }}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        {children}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </SetterContext.Provider>
  );
};
