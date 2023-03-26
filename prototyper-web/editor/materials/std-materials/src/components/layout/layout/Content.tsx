import { SetterForm } from '@prototyper/editor';
import { Layout as AntdLayout } from 'antd';
import React, { PropsWithChildren } from 'react';

import { useConnectors } from '../../../utils/useConnectors';
import { DropArea } from '../../basic';

export const Content = ({ children, ...props }: PropsWithChildren) => {
  const { connectAndDrag } = useConnectors();

  return (
    <AntdLayout.Content {...props} ref={connectAndDrag}>
      <DropArea>{children}</DropArea>
    </AntdLayout.Content>
  );
};

export const ContentSettings = () => {
  return <SetterForm></SetterForm>;
};
