import { FMT_EXPR, JS_EXPR } from '@prototyper/core/src/utils';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import React, { useMemo } from 'react';
import { FC } from 'react';

import { FormItem } from '../form';

export const TextSetter: FC<
  {
    propName: string;
    label: string;
    singleLine?: boolean;
    jsOnly?: boolean;
  } & TextAreaProps
> = ({ propName, label, singleLine, jsOnly, ...props }) => {
  const placeholder = useMemo(() => {
    const k = propName;
    if (k.startsWith('on') || k.endsWith('val') || k.endsWith('Val')) {
      return '请输入一个JS表达式';
    } else if (k.endsWith('Expr') || k.endsWith('expr')) {
      return '请输入一个格式化字符串，用#{xxx}来编写JS表达式';
    }
  }, [propName]);
  const InputComponent = singleLine ? Input : Input.TextArea;
  return (
    <FormItem
      propName={propName}
      label={label}
      allow={jsOnly ? [JS_EXPR] : ['', FMT_EXPR, JS_EXPR]}
    >
      <InputComponent
        placeholder={placeholder}
        {...(props as any)}
      ></InputComponent>
    </FormItem>
  );
};
