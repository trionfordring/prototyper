import { BoolSetter, HTMLSetter, SetterForm } from '@prototyper/editor';
import { Layout as AntdLayout } from 'antd';
import React, { PropsWithChildren } from 'react';

import { useConnectors } from '../../../utils/useConnectors';
import { DropArea } from '../../basic';

export const Layout = ({ children, ...props }: PropsWithChildren) => {
  const { connectAndDrag } = useConnectors();

  return (
    <AntdLayout {...props} ref={connectAndDrag}>
      <DropArea>{children}</DropArea>
    </AntdLayout>
  );
};

export const LayoutSettings = () => {
  return (
    <SetterForm>
      <BoolSetter propName="hasSider" label="hasSider" />
      <HTMLSetter />
    </SetterForm>
  );
};
