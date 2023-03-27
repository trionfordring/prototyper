import { useSetterContext } from '@prototyper/core';
import {
  AutoCompleteSetter,
  HTMLSetter,
  SegmentedSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Form, Select } from 'antd';
import React, { Fragment } from 'react';

import { useConnectors } from '../../utils/useConnectors';
import { usePlaceholder } from '../../utils/usePlaceholder';

type HTMLTextType = 'title' | 'text' | 'paragraph' | 'link';
function getHTMLTextComponent(type?: HTMLTextType, level?: number) {
  switch (type) {
    case 'paragraph':
      return 'p';
    case 'title':
      return 'h' + level;
    case 'text':
      return 'span';
    case 'link':
      return 'a';
    default:
      return 'span';
  }
}
export const HTMLText = ({
  text: textProps,
  domType,
  level,
  ...props
}: {
  text: string;
  domType?: HTMLTextType;
  level?: number;
  [key: string]: any;
}) => {
  const { connectAndDrag } = useConnectors();
  const typoComponent = getHTMLTextComponent(domType, level);
  const text = usePlaceholder(() => '点击此处编辑文本', textProps);
  return React.createElement(
    typoComponent,
    {
      ...props,
      ref: connectAndDrag,
    },
    text
  );
};

export const HTMLTextSettings = () => {
  const { runtimeDomType } = useSetterContext((props) => ({
    runtimeDomType: props.domType,
  }));
  const [form] = Form.useForm();
  const domType = Form.useWatch('domType', form);
  return (
    <SetterForm form={form}>
      <Form.Item
        name="domType"
        label="标记类型"
        initialValue={runtimeDomType || 'text'}
      >
        <Select
          options={[
            { value: 'text', label: '文本' },
            { value: 'title', label: '标题' },
            { value: 'paragraph', label: '段落' },
            { value: 'link', label: '链接' },
          ]}
        ></Select>
      </Form.Item>
      {domType === 'title' ? (
        <SegmentedSetter
          propName="level"
          label="标题级别"
          options={[
            { value: 1, label: 'h1' },
            { value: 2, label: 'h2' },
            { value: 3, label: 'h3' },
            { value: 4, label: 'h4' },
            { value: 5, label: 'h5' },
          ]}
        />
      ) : null}
      <TextSetter propName="text" label="文本" />
      {domType === 'link' ? (
        <Fragment>
          <TextSetter propName="href" label="超链接" />
          <AutoCompleteSetter
            propName="target"
            label="打开方式"
            options={[
              { value: '_self', label: '_self (在当前窗口打开。默认。)' },
              { value: '_blank', label: '_blank (在新窗口打开)' },
              { value: '_parent', label: '_parent (在父级窗口打开)' },
              { value: '_top', label: '_top (在最顶级窗口打开)' },
              { value: '_new', label: '_new (始终在同一个新窗口中打开)' },
            ]}
          />
        </Fragment>
      ) : null}
      <HTMLSetter />
    </SetterForm>
  );
};
