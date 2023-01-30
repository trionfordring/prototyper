import { useSetterContext } from '@prototyper/core';
import {
  AutoCompleteSetter,
  BoolSetter,
  SegmentedSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Typography as Ant, Form, Select } from 'antd';
import React, { Fragment } from 'react';

import { useConnectors } from '../../utils/useConnectors';
import { usePlaceholder } from '../../utils/usePlaceholder';

type TypographyType = 'title' | 'text' | 'paragraph' | 'link';
function getTypographyComponent(type?: TypographyType) {
  switch (type) {
    case 'paragraph':
      return Ant.Paragraph;
    case 'title':
      return Ant.Title;
    case 'text':
      return Ant.Text;
    case 'link':
      return Ant.Link;
    default:
      return Ant.Text;
  }
}
export const Typography = ({
  text: textProps,
  domType,
  ...props
}: {
  text: string;
  domType?: TypographyType;
}) => {
  const { connectAndDrag } = useConnectors();
  const TypoComponent = getTypographyComponent(domType);
  const text = usePlaceholder(() => '点击此处编辑文本', textProps);
  return (
    <TypoComponent ref={connectAndDrag} {...props}>
      {text}
    </TypoComponent>
  );
};

export const TypographySettings = () => {
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
      <AutoCompleteSetter
        propName="type"
        label="文本类型"
        options={[
          {
            label: <Ant.Text type="secondary">secondary(次要)</Ant.Text>,
            value: 'secondary',
          },
          {
            label: <Ant.Text type="success">success(成功)</Ant.Text>,
            value: 'success',
          },
          {
            label: <Ant.Text type="warning">warning(警告)</Ant.Text>,
            value: 'warning',
          },
          {
            label: <Ant.Text type="danger">danger(危险)</Ant.Text>,
            value: 'danger',
          },
        ]}
      />
      <TextSetter propName="className" label="类名" singleLine />
      <BoolSetter propName="code" label="代码样式" />
      <BoolSetter propName="delete" label="删除线" />
      <BoolSetter propName="editable" label="可否编辑" />
      <BoolSetter propName="ellipsis" label="溢出省略" />
      <BoolSetter propName="keyboard" label="键盘样式" />
      <BoolSetter propName="mark" label="标记样式" />
      <BoolSetter propName="strong" label="加粗" />
      <BoolSetter propName="italic" label="斜体" />
      <BoolSetter propName="underline" label="下划线" />
    </SetterForm>
  );
};
