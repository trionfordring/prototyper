import React, { PropsWithChildren } from 'react';

export const createBlockDropArea = (Container: React.ElementType) => {
  return ({ children }: PropsWithChildren) => {
    return <Container>{children}</Container>;
  };
};
