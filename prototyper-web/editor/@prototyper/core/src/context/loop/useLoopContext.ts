import React from 'react';

import { LoopContext } from './LoopContext';

export const useLoopContext = () => {
  return React.useContext(LoopContext);
};
