import { useSetterContext } from '@prototyper/core';
import { Form, Switch, SwitchProps } from 'antd';
import React from 'react';
import { FC } from 'react';

export const SwitchSetter: FC<
  {
    propName: string;
    label: string;
  } & SwitchProps
> = ({ propName, label, ...props }) => {
  const { propValue } = useSetterContext((props) => ({
    propValue: props[propName],
  }));
  return (
    <Form.Item name={propName} label={label} initialValue={propValue}>
      <Switch {...props}></Switch>
    </Form.Item>
  );
};
