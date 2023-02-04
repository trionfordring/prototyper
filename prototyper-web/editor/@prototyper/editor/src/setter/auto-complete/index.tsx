import { FMT_EXPR, JS_EXPR } from '@prototyper/core';
import { AutoComplete as AC, AutoCompleteProps } from 'antd';
import React, { useMemo } from 'react';
import { FC } from 'react';

import { FormItem } from '../form';

export const AutoCompleteSetter: FC<
  {
    propName: string;
    label: string;
  } & AutoCompleteProps
> = ({ propName, label, ...props }) => {
  const placeholder = useMemo(() => {
    const k = propName;
    if (k.startsWith('on') || k.endsWith('val') || k.endsWith('Val')) {
      return '请输入一个JS表达式';
    } else if (k.endsWith('Expr') || k.endsWith('expr')) {
      return '请输入一个格式化字符串，用#{xxx}来编写JS表达式';
    }
  }, [propName]);
  return (
    <FormItem propName={propName} label={label} allow={['', FMT_EXPR, JS_EXPR]}>
      <AC placeholder={placeholder} {...props}></AC>
    </FormItem>
  );
};
