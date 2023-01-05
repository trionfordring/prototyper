import { useNode } from '@prototyper/core';
import { Form, Input } from 'antd';
import React, { useContext } from 'react';
import { FC } from 'react';

import { SetterContext } from '../form';

export const TextSetter: FC<{
  propName: string;
  label: string;
}> = ({ propName, label }) => {
  const { virtualMode } = useContext(SetterContext);
  const { propValue } = useNode((node) => ({
    propValue: virtualMode
      ? (node.data.props.props || {})[propName]
      : node.data.props[propName],
  }));
  return (
    <Form.Item name={propName} label={label} initialValue={propValue}>
      <Input.TextArea></Input.TextArea>
    </Form.Item>
  );
};
