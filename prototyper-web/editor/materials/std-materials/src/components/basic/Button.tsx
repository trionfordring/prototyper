import { PreDefinedElement, useElements } from '@prototyper/core';
import {
  AutoCompleteSetter,
  BoolSetter,
  HTMLSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Button as AntdButton, Form } from 'antd';
import React from 'react';
import { FC, PropsWithChildren } from 'react';

import { HTMLText } from './HTMLText';

import { useConnectors } from '../../utils/useConnectors';
import { usePlaceholder } from '../../utils/usePlaceholder';

export const Button: FC<PropsWithChildren> = ({ children, ...props }) => {
  useElements(
    children
      ? []
      : [
          {
            id: 'content',
            is: HTMLText,
            text: '按钮',
            custom: {
              propsMapper: {
                text: 'fmtExpr',
              },
            },
          },
        ]
  );
  const placeholder = <PreDefinedElement id="content"></PreDefinedElement>;
  const { connectAndDrag } = useConnectors();
  const content = usePlaceholder(placeholder, children, placeholder);
  return (
    <AntdButton ref={connectAndDrag} {...props}>
      {content}
    </AntdButton>
  );
};

export const ButtonSettings = () => {
  const [form] = Form.useForm();
  const link = Form.useWatch('href', form);
  return (
    <SetterForm form={form}>
      <BoolSetter propName="block" label="块状样式" />
      <BoolSetter propName="danger" label="危险样式" />
      <BoolSetter propName="disabled" label="禁用按钮" />
      <BoolSetter propName="ghost" label="幽灵样式" />
      <BoolSetter propName="loading" label="加载样式" />

      <TextSetter propName="href" label="跳转地址" />
      {link ? (
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
      ) : (
        <AutoCompleteSetter
          propName="htmlType"
          label="按钮类型"
          options={[
            { value: 'submit', label: 'submit(提交表单)' },
            { value: 'reset', label: 'reset(重置表单)' },
            { value: 'button', label: 'button(默认)' },
          ]}
          placeholder="默认为button"
        />
      )}
      <AutoCompleteSetter
        propName="shape"
        label="按钮形状"
        options={[
          { value: 'default', label: 'default(默认样式)' },
          { value: 'circle', label: 'circle(圆形)' },
          { value: 'round', label: 'round(弧形)' },
        ]}
        placeholder="默认为default"
      />
      <AutoCompleteSetter
        propName="size"
        label="按钮尺寸"
        options={[
          { value: 'large', label: 'large' },
          { value: 'middle', label: 'middle(默认)' },
          { value: 'small', label: 'small' },
        ]}
        placeholder="默认为middle"
      />
      <AutoCompleteSetter
        propName="type"
        label="按钮类型"
        options={[
          {
            label: (
              <AntdButton type="primary" size="small">
                primary
              </AntdButton>
            ),
            value: 'primary',
          },
          {
            label: (
              <AntdButton type="ghost" size="small">
                ghost
              </AntdButton>
            ),
            value: 'ghost',
          },
          {
            label: (
              <AntdButton type="dashed" size="small">
                dashed
              </AntdButton>
            ),
            value: 'dashed',
          },
          {
            label: (
              <AntdButton type="link" size="small">
                link
              </AntdButton>
            ),
            value: 'link',
          },
          {
            label: (
              <AntdButton type="text" size="small">
                text
              </AntdButton>
            ),
            value: 'text',
          },
          {
            label: (
              <AntdButton type="default" size="small">
                default
              </AntdButton>
            ),
            value: 'default',
          },
        ]}
        placeholder="默认为default"
      />
      <HTMLSetter />
    </SetterForm>
  );
};
