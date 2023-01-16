import React from 'react';

export interface LoopContextType {
  key: any;
  index: number;
  value: any;
  array: Array<any>;
}

export const LoopContext = React.createContext<LoopContextType | undefined>(
  undefined
);

LoopContext.displayName = 'LoopContext';
