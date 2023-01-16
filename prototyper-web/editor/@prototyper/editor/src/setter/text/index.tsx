import { useSetterContext } from '@prototyper/core';
import { Form, Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import React, { useMemo } from 'react';
import { FC } from 'react';

export const TextSetter: FC<
  {
    propName: string;
    label: string;
  } & TextAreaProps
> = ({ propName, label, ...props }) => {
  const { propValue } = useSetterContext((props) => ({
    propValue: props[propName],
  }));
  const placeholder = useMemo(() => {
    const k = propName;
    if (k.startsWith('on') || k.endsWith('val') || k.endsWith('Val')) {
      return '请输入一个JS表达式';
    } else if (k.endsWith('Expr') || k.endsWith('expr')) {
      return '请输入一个格式化字符串，用#{xxx}来编写JS表达式';
    }
  }, [propName]);
  return (
    <Form.Item name={propName} label={label} initialValue={propValue}>
      <Input.TextArea placeholder={placeholder} {...props}></Input.TextArea>
    </Form.Item>
  );
};
