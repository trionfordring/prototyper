import React from 'react';

import { ApplicationContext } from './ApplicationContext';

export function useApplicationContext() {
  return React.useContext(ApplicationContext);
}
