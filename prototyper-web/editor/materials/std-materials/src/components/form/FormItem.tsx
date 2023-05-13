import { useComponentContext } from '@prototyper/core';
import {
  BoolSetter,
  EventSetter,
  JSSetter,
  SegmentedSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Form, FormItemProps } from 'antd';
import { PropsWithChildren, useEffect } from 'react';
import React from 'react';

import { DEFALUT_LAYOUT } from './Form';

import { useConnectors } from '../../utils/useConnectors';
import { DropArea } from '../basic/DropArea';

export function FormItem({
  children,
  ...props
}: PropsWithChildren<FormItemProps>) {
  const { editing } = useComponentContext()!;
  const { connectAndDrag } = useConnectors();
  const form = Form.useFormInstance();
  useEffect(() => {
    console.log(form.getFieldsValue());
  }, [form]);
  console.log('children', children);
  if (editing) {
    return (
      <div ref={connectAndDrag}>
        <Form.Item {...props}>
          {children ? (
            children
          ) : (
            <DropArea
              label="拖入表单组件"
              dragoverLabel="松开"
              asChildren
            ></DropArea>
          )}
        </Form.Item>
      </div>
    );
  }
  return <Form.Item {...props}>{children}</Form.Item>;
}

const DEFALUT_FN = `// @export(transform)
// 组件获取值后进行转换，再放入Form中。不支持异步
function transform(value, prevValue, prevValues) {
  return value;
}
`;

export function FormItemSettings() {
  return (
    <SetterForm>
      <TextSetter propName="name" label="name" />
      <TextSetter propName="label" label="label" />
      <JSSetter propName="initialValue" label="初始值" />
      <TextSetter propName="tooltip" label="提示" />
      <BoolSetter propName="noStyle" label="无样式" />
      <BoolSetter propName="colon" label="显示冒号" defaultChecked />
      <BoolSetter propName="hidden" label="隐藏" />
      <SegmentedSetter
        propName="labelAlign"
        label="标签对齐"
        options={[
          { value: 'left', label: '左对齐' },
          { value: 'right', label: '右对齐' },
        ]}
        defaultValue="right"
      />
      <JSSetter
        propName="labelCol"
        label="标签布局"
        defaultValue={DEFALUT_LAYOUT}
      />
      <JSSetter propName="rules" label="校验规则" defaultArr />
      <TextSetter propName="validateTrigger" label="校验触发" />
      <BoolSetter propName="preserve" label="preserve" />
      <JSSetter propName="normalize" label="值映射" defaultValue={DEFALUT_FN} />
      <EventSetter
        extEvents={{
          label: '字段事件',
          children: ['onMetaChange', 'onReset'],
        }}
      />
      <TextSetter
        singleLine
        propName="trigger"
        label="trigger"
        placeholder="设置收集字段值变更的时机。默认为onChange"
      />
    </SetterForm>
  );
}
