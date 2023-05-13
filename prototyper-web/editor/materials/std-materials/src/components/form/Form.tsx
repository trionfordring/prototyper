import { useComponentContext } from '@prototyper/core';
import {
  BoolSetter,
  EventSetter,
  JSSetter,
  SegmentedSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Form as AntForm, FormProps } from 'antd';
import React, { PropsWithChildren } from 'react';

import { useConnectors } from '../../utils/useConnectors';
import { DropArea } from '../basic/DropArea';

export function Form({ children, ...props }: PropsWithChildren<FormProps>) {
  const { editing } = useComponentContext()!;
  const { connectAndDrag } = useConnectors();
  if (editing) {
    return (
      <div
        ref={connectAndDrag}
        style={{
          display: props.layout === 'inline' ? 'inline' : 'block',
        }}
      >
        <AntForm {...props}>
          {children}
          <DropArea
            label="将表单字段拖拽到这里来创建一个新的输入项。"
            dragoverLabel="松开"
          ></DropArea>
        </AntForm>
      </div>
    );
  }
  return <AntForm {...props}>{children}</AntForm>;
}

export const DEFALUT_LAYOUT = `// @export(data)
const data = {
  // span: 3,
  // offset: 12,
}
`;

export function FormSettings() {
  return (
    <SetterForm>
      <TextSetter jsOnly singleLine propName="form" label="表单实例" />
      <JSSetter propName="initialValues" label="初始值" />
      <BoolSetter propName="disabled" label="禁用" />
      <BoolSetter propName="colon" label="显示冒号" defaultChecked />
      <SegmentedSetter
        propName="labelAlign"
        label="标签对齐"
        options={[
          { value: 'left', label: '左对齐' },
          { value: 'right', label: '右对齐' },
        ]}
        defaultValue="right"
      />
      <BoolSetter propName="labelWrap" label="标签换行" />
      <JSSetter
        propName="labelCol"
        label="标签布局"
        defaultValue={DEFALUT_LAYOUT}
      />
      <SegmentedSetter
        propName="layout"
        label="表单布局"
        options={[
          { value: 'horizontal', label: '水平' },
          { value: 'vertical', label: '垂直' },
          { value: 'inline', label: '行内' },
        ]}
        defaultValue="horizontal"
      />
      <TextSetter singleLine propName="name" label="name" />
      <BoolSetter propName="preserve" label="preserve" />
      <BoolSetter propName="scrollToFirstError" label="scrollToFirstError" />
      <SegmentedSetter
        propName="size"
        label="表单尺寸"
        options={[
          { value: '', label: '默认' },
          { value: 'small', label: '小号' },
          { value: 'middle', label: '中号' },
          { value: 'large', label: '大号' },
        ]}
        defaultValue=""
      />
      <EventSetter
        extEvents={{
          label: '表单事件',
          children: [
            'onFinish',
            'onFieldsChange',
            'onFinishFailed',
            'onValuesChange',
          ],
        }}
      />
    </SetterForm>
  );
}
