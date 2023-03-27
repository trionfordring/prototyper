import { HTMLSetter, SetterForm } from '@prototyper/editor';
import { Layout as AntdLayout } from 'antd';
import React, { PropsWithChildren } from 'react';

import { useConnectors } from '../../../utils/useConnectors';
import { DropArea } from '../../basic';

export const Footer = ({ children, ...props }: PropsWithChildren) => {
  const { connectAndDrag } = useConnectors();

  return (
    <AntdLayout.Footer {...props} ref={connectAndDrag}>
      <DropArea>{children}</DropArea>
    </AntdLayout.Footer>
  );
};

export const FooterSettings = () => {
  return (
    <SetterForm>
      <HTMLSetter />
    </SetterForm>
  );
};
