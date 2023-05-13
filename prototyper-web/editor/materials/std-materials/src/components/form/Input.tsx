import { useComponentContext } from '@prototyper/core';
import {
  AutoCompleteSetter,
  BoolSetter,
  FormHeader,
  HTMLSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Input as AntInput, InputProps, Tooltip } from 'antd';
import React, { PropsWithChildren } from 'react';

import { useConnectors } from '../../utils/useConnectors';

export function Input(props: InputProps) {
  const { connectAndDrag } = useConnectors();
  const { editing } = useComponentContext()!;
  if (editing) {
    return (
      <div ref={connectAndDrag}>
        <AntInput {...props} />
      </div>
    );
  }
  return <AntInput {...props} />;
}

export function InputSetter({
  children,
  enableDefault,
}: PropsWithChildren<{
  enableDefault?: boolean;
}>) {
  return (
    <>
      <FormHeader title="受控属性">
        <Tooltip title="当受到表单控制时，无法设置受控组件。">
          <span>❕</span>
        </Tooltip>
      </FormHeader>
      {children}
      {enableDefault ? (
        <>
          <TextSetter propName="value" label="值" />
          <TextSetter propName="defaultValue" label="默认值" />
        </>
      ) : null}
      <TextSetter jsOnly singleLine propName="onChange" label="当修改时" />
      <TextSetter jsOnly singleLine propName="onBlur" label="当失去焦点" />
    </>
  );
}
export const CONTROLLER_EVENTS = ['onChange', 'onBlur'];
export const filterControlleredEvents = (e) => !CONTROLLER_EVENTS.includes(e);
export function InputSettings() {
  return (
    <SetterForm>
      <BoolSetter propName="allowClear" label="清除按钮" />
      <BoolSetter propName="bordered" label="显示边框" defaultChecked />
      <BoolSetter propName="disabled" label="禁用" />
      <AutoCompleteSetter
        propName="type"
        label="输入类型"
        options={[
          { value: 'text', label: '文本' },
          { value: 'email', label: '邮箱' },
          { value: 'tel', label: '电话' },
          { value: 'color', label: '颜色' },
          { value: 'month', label: '年月' },
          { value: 'data', label: '日期' },
          { value: 'datetime-local', label: '日期时间' },
          { value: 'time', label: '时间' },
          { value: 'range', label: '范围' },
          { value: 'file', label: '文件' },
        ]}
      />

      <TextSetter propName="maxLength" label="最大长度" singleLine jsOnly />
      <InputSetter enableDefault />
      <HTMLSetter filterEvents={filterControlleredEvents} />
    </SetterForm>
  );
}
