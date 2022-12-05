import React from 'react';

import { ComponentContext } from './ComponentContext';

export function useComponentContext() {
  return React.useContext(ComponentContext);
}
