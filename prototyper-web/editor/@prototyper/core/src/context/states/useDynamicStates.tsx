import React from 'react';

import { DynamicStatesContext } from './DynamicStatesContext';

export function useDynamicStates() {
  return React.useContext(DynamicStatesContext);
}
