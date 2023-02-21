import React from 'react';

export const DynamicStatesContext = React.createContext<{
  data?: any;
  hasInited: boolean;
}>({
  hasInited: false,
});
