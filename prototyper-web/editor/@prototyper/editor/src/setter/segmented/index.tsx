import { FMT_EXPR, JS_EXPR } from '@prototyper/core';
import { Form, Input, InputProps, Segmented, SegmentedProps } from 'antd';
import React from 'react';
import { FC } from 'react';

import { FormItem } from '../form';

export const SegmentedSetter: FC<
  {
    propName: string;
    label: string;
  } & (InputProps | SegmentedProps)
> = ({ propName, label, ...props }) => {
  const formPropType = Form.useWatch(
    ['propsMapper', propName],
    Form.useFormInstance()
  );
  return (
    <FormItem propName={propName} label={label} allow={['', FMT_EXPR, JS_EXPR]}>
      {formPropType === JS_EXPR ? (
        <Input placeholder="输入JS表达式" {...(props as any)}></Input>
      ) : (
        <Segmented {...(props as any)}></Segmented>
      )}
    </FormItem>
  );
};
