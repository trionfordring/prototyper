import { useNode } from '@craftjs/core';
import React from 'react';

import { SetterCommonContextProvider } from './SetterCommonContextProvider';

export const SetterContextProvider = ({
  virtual,
  children,
}: React.PropsWithChildren<{ virtual?: boolean }>) => {
  const { id } = useNode();
  return (
    <SetterCommonContextProvider id={id} virtual={virtual}>
      {children}
    </SetterCommonContextProvider>
  );
};
