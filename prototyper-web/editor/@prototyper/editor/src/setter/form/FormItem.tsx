import { useSetterContext } from '@prototyper/core';
import { FMT_EXPR, JS_EXPR, SimplePropDeclear } from '@prototyper/core';
import { Form, FormItemProps, Popover, Segmented, Tag } from 'antd';
import React, { PropsWithChildren, forwardRef, useMemo } from 'react';
import styled from 'styled-components';

import { IconBraces } from '../../icons/IconBraces';
import { IconJavascript } from '../../icons/IconJavascript';
import { IconText } from '../../icons/IconText';

export const FormItem = ({
  children,
  propName,
  label,
  allow: allowProp,
  ...props
}: PropsWithChildren<
  {
    propName: string;
    label: string;
    allow?: (SimplePropDeclear | '')[];
  } & FormItemProps
>) => {
  const { propValue, propType } = useSetterContext((props, mapper) => ({
    propValue: props[propName],
    propType: mapper && mapper[propName],
  }));
  const allow = useMemo(() => {
    const k = propName;
    if (k.startsWith('on') || k.endsWith('val') || k.endsWith('Val')) {
      return [JS_EXPR];
    } else if (k.endsWith('Expr') || k.endsWith('expr')) {
      return [FMT_EXPR];
    }
    if (!allowProp) return null;
    return allowProp;
  }, [propName, allowProp]);

  const labelNode = (
    <React.Fragment>
      {!allow ? null : allow.length === 1 ? (
        <TypeTag type={allow[0]} />
      ) : (
        <Form.Item
          name={['propsMapper', propName]}
          initialValue={propType || ''}
          noStyle
        >
          <TypeTagInput allow={allow} />
        </Form.Item>
      )}
      <span>{label}</span>
    </React.Fragment>
  );
  return (
    <Form.Item
      {...props}
      name={propName}
      label={labelNode}
      initialValue={propValue}
    >
      {children}
    </Form.Item>
  );
};

const IconBox = styled.div`
  height: 3em;
  width: 3em;
  margin: 0 auto;
`;

const TypeTagInput = ({
  allow,
  value,
  onChange,
}: {
  allow: string[];
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const selector = (
    <Segmented
      value={value}
      onChange={onChange}
      options={[
        {
          label: 'JS',
          value: JS_EXPR,
          icon: (
            <IconBox>
              <IconJavascript />
            </IconBox>
          ),
        },
        {
          label: 'FMT',
          value: FMT_EXPR,
          icon: (
            <IconBox>
              <IconBraces />
            </IconBox>
          ),
        },
        {
          label: 'PLAIN',
          value: '',
          icon: (
            <IconBox>
              <IconText />
            </IconBox>
          ),
        },
      ].filter((item) => allow.includes(item.value))}
    ></Segmented>
  );
  return (
    <Popover
      title="选择类型"
      content={selector}
      getPopupContainer={(trigger) => trigger}
    >
      <TypeTag type={value} />
    </Popover>
  );
};

const type2String = (type?: string) => {
  switch (type) {
    case JS_EXPR:
      return 'JS';
    case FMT_EXPR:
      return 'FMT';
    default:
      return 'RAW';
  }
};
const TypeTagEle = styled(Tag as any)`
  margin-inline-end: 0.5em;
  padding-inline: 0;
  width: 2.5em;
  text-align: center;
  line-height: initial;
  flex-grow: 1;
  position: relative;
`;
const TypeTag = forwardRef<HTMLElement, { type?: string }>(
  ({ type, ...props }, ref) => {
    return (
      <TypeTagEle
        {...props}
        color={
          type === JS_EXPR ? 'orange' : type === FMT_EXPR ? 'blue' : 'default'
        }
        ref={ref}
      >
        {type2String(type)}
      </TypeTagEle>
    );
  }
);
