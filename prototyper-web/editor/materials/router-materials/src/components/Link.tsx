import { useComponentContext } from '@prototyper/core';
import {
  BoolSetter,
  HTMLSetter,
  JSSetter,
  SetterForm,
} from '@prototyper/editor';
import React, { PropsWithChildren } from 'react';
import { Link as RLink, LinkProps } from 'react-router-dom';

import { useConnectors } from '../utils/useConnectors';

export function Link(props: PropsWithChildren<LinkProps>) {
  const { connectAndDrag } = useConnectors();
  const { editing } = useComponentContext()!;
  const content = editing && !props.children ? '路由链接' : props.children;
  return (
    <RLink ref={connectAndDrag} {...props} to={props.to || '#'}>
      {content}
    </RLink>
  );
}
const DEFAULT_TO = `// @export(data)
const data = {
  pathname: "",
  search: "",
  hash: ""
}
`;

export function LinkSettings() {
  return (
    <SetterForm>
      <JSSetter label="目标" propName="to" defaultValue={DEFAULT_TO} />
      <JSSetter label="数据" propName="state" />
      <BoolSetter label="replace" propName="replace" />
      <BoolSetter label="刷新页面" propName="reloadDocument" />
      <BoolSetter label="阻止上滚" propName="preventScrollReset" />
      <HTMLSetter />
    </SetterForm>
  );
}
