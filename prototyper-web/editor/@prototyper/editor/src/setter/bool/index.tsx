import { JS_EXPR } from '@prototyper/core';
import { Form, Input, InputProps, Switch, SwitchProps } from 'antd';
import React from 'react';
import { FC } from 'react';

import { FormItem } from '../form';

export const BoolSetter: FC<
  {
    propName: string;
    label: string;
  } & (InputProps & SwitchProps)
> = ({ propName, label, defaultChecked, ...props }) => {
  const formPropType = Form.useWatch(
    ['propsMapper', propName],
    Form.useFormInstance()
  );
  return (
    <FormItem
      propName={propName}
      label={label}
      allow={['', JS_EXPR]}
      valuePropName="checked"
      initialValue={defaultChecked}
    >
      {formPropType === JS_EXPR ? (
        <Input placeholder="输入Bool类型的JS表达式" {...(props as any)}></Input>
      ) : (
        <Switch {...(props as any)}></Switch>
      )}
    </FormItem>
  );
};
