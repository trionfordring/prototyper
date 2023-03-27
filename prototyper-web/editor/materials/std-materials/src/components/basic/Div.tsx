import { HTMLSetter, SetterForm } from '@prototyper/editor';
import React, { HTMLAttributes } from 'react';
import { PropsWithChildren } from 'react';

import { DropArea } from './DropArea';

import { useConnectors } from '../../utils/useConnectors';

export const Div = ({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  const { connectAndDrag } = useConnectors();
  return (
    <div {...props} ref={connectAndDrag}>
      <DropArea>{children}</DropArea>
    </div>
  );
};

export const DivSettings = () => {
  return (
    <SetterForm>
      <HTMLSetter />
    </SetterForm>
  );
};
