import { JS_EXPR } from '@prototyper/core';
import { Form, Input, InputProps, Slider, SliderSingleProps } from 'antd';
import React from 'react';

import { FormItem } from '../form';

export const SliderSetter = ({
  propName,
  label,
  ...props
}: {
  propName: string;
  label: string;
} & (InputProps | SliderSingleProps)) => {
  const formPropType = Form.useWatch(
    ['propsMapper', propName],
    Form.useFormInstance()
  );
  return (
    <FormItem propName={propName} label={label} allow={['', JS_EXPR]}>
      {formPropType === JS_EXPR ? (
        <Input placeholder="输入JS表达式" {...(props as any)}></Input>
      ) : (
        <Slider {...(props as any)}></Slider>
      )}
    </FormItem>
  );
};
