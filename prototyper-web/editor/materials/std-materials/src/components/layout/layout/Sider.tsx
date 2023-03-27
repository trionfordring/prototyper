import { BoolSetter, HTMLSetter, SetterForm } from '@prototyper/editor';
import { Layout as AntdLayout } from 'antd';
import React, { PropsWithChildren } from 'react';

import { useConnectors } from '../../../utils/useConnectors';
import { DropArea } from '../../basic';

export const Sider = ({ children, ...props }: PropsWithChildren) => {
  const { connectAndDrag } = useConnectors();

  return (
    <AntdLayout.Sider {...props} ref={connectAndDrag}>
      <DropArea>{children}</DropArea>
    </AntdLayout.Sider>
  );
};

export const SiderSettings = () => {
  return (
    <SetterForm>
      <BoolSetter propName="collapsed" label="收起" />
      <BoolSetter propName="collapsible" label="可否收起" />
      <BoolSetter propName="defaultCollapsed" label="默认收起" />
      <HTMLSetter />
    </SetterForm>
  );
};
