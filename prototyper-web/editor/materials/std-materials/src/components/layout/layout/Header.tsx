import { SetterForm } from '@prototyper/editor';
import { Layout as AntdLayout } from 'antd';
import React, { PropsWithChildren } from 'react';

import { useConnectors } from '../../../utils/useConnectors';
import { DropArea } from '../../basic';

export const Header = ({ children, ...props }: PropsWithChildren) => {
  const { connectAndDrag } = useConnectors();

  return (
    <AntdLayout.Header {...props} ref={connectAndDrag}>
      <DropArea>{children}</DropArea>
    </AntdLayout.Header>
  );
};

export const HeaderSettings = () => {
  return <SetterForm></SetterForm>;
};
