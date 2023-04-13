import { useComponentContext, useSetterContext } from '@prototyper/core';
import {
  AutoCompleteSetter,
  BoolSetter,
  HTMLSetter,
  JSSetter,
  SegmentedSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Typography as Ant, Form, Select } from 'antd';
import type { LinkProps } from 'antd/es/typography/Link';
import { noop } from 'lodash';
import React, { Fragment, PropsWithChildren } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import type { LinkProps as RLinkProps } from 'react-router-dom';

import { useConnectors } from '../../utils/useConnectors';
import { usePlaceholder } from '../../utils/usePlaceholder';

/* eslint-disable react-hooks/rules-of-hooks */
const useNavigate = ReactRouterDom?.useNavigate;
const useHref = ReactRouterDom?.useHref;
function RouterLink({
  onClick = noop,
  children,
  to: toProp,
  state,
  relative,
  preventScrollReset,
  replace,
  ...props
}: PropsWithChildren<LinkProps & Partial<RLinkProps>>) {
  const { editing } = useComponentContext()!;
  if (!useNavigate || !useHref)
    return (
      <Ant.Link {...props} onClick={onClick}>
        {editing ? <>{children}(无效的路由链接)</> : children}
      </Ant.Link>
    );
  const to = toProp || '';
  const navigate = useNavigate();
  const href = useHref(to) || props.href;
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    navigate(to, {
      state,
      relative,
      preventScrollReset,
      replace,
    });
    onClick(e as any);
  }
  return (
    <Ant.Link {...props} href={href} onClick={handleClick}>
      {children}
    </Ant.Link>
  );
}
/* eslint-enble react-hooks/rules-of-hooks */

type TypographyType = 'title' | 'text' | 'paragraph' | 'link' | 'router-link';
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
    case 'router-link':
      return RouterLink;
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
const DEFAULT_TO = `// @export(data)
const data = {
  pathname: "",
  search: "",
  hash: ""
}
`;

export const TypographySettings = () => {
  const { runtimeDomType } = useSetterContext((props) => ({
    runtimeDomType: props.domType,
  }));
  const [form] = Form.useForm();
  const domType = Form.useWatch('domType', form);
  const options = [
    { value: 'text', label: '文本' },
    { value: 'title', label: '标题' },
    { value: 'paragraph', label: '段落' },
    { value: 'link', label: '链接' },
  ];
  if (ReactRouterDom) options.push({ value: 'router-link', label: '路由链接' });
  return (
    <SetterForm form={form}>
      <Form.Item
        name="domType"
        label="标记类型"
        initialValue={runtimeDomType || 'text'}
      >
        <Select options={options}></Select>
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
      {domType === 'router-link' ? (
        <Fragment>
          <JSSetter propName="to" label="路由目标" defaultValue={DEFAULT_TO} />
          <JSSetter label="数据" propName="state" />
          <BoolSetter label="replace" propName="replace" />
          <BoolSetter label="阻止上滚" propName="preventScrollReset" />
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
      <BoolSetter propName="code" label="代码样式" />
      <BoolSetter propName="delete" label="删除线" />
      <BoolSetter propName="editable" label="可否编辑" />
      <BoolSetter propName="ellipsis" label="溢出省略" />
      <BoolSetter propName="keyboard" label="键盘样式" />
      <BoolSetter propName="mark" label="标记样式" />
      <BoolSetter propName="strong" label="加粗" />
      <BoolSetter propName="italic" label="斜体" />
      <BoolSetter propName="underline" label="下划线" />
      <HTMLSetter />
    </SetterForm>
  );
};
