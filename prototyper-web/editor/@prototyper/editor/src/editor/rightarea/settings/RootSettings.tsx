import {
  SetterRootContextProvider,
  useApplicationContext,
} from '@prototyper/core';
import React from 'react';

export const RootSettings = () => {
  const {
    currentComponent: { settings },
  } = useApplicationContext();
  return settings ? (
    <SetterRootContextProvider>
      {React.createElement(settings)}
    </SetterRootContextProvider>
  ) : null;
};
