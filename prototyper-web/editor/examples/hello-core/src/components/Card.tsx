import { Element } from '@prototyper/core';
import React, { FC, PropsWithChildren } from 'react';

import { Container } from './Container';
import { DropArea } from './DropArea';

export const Card: FC<
  PropsWithChildren<{
    color?: string;
  }>
> = ({ children, color }) => {
  const ele1 = <Element id="1" is={DropArea} canvas></Element>;
  return (
    <Container color={color}>
      <div>
        ele1:
        {ele1}
      </div>
      <hr />
      <div>
        ele1-2:
        {ele1}
      </div>
      <hr />
      <div>
        ele2:
        <Element id="2" is={DropArea} canvas></Element>
      </div>
      <hr />
      <div>
        children:
        <DropArea>{children}</DropArea>
      </div>
    </Container>
  );
};
