import React from 'react';

export interface SetterContextType {
  setProps: (props: Record<string, any>) => void;
  setHidden: (hide: string) => void;
  hiddenVal?: string;
  setSlot: (isSlot?: boolean) => void;
  slot: boolean;
  setFor: (expr) => void;
  forVal?: string;
  isRoot: boolean;
  props: any;
}

export const SetterContext = React.createContext<SetterContextType | undefined>(
  undefined
);

SetterContext.displayName = 'SetterContext';
