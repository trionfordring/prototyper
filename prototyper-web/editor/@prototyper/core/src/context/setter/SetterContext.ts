import React from 'react';

export interface SetterContextType {
  setProps: (props: Record<string, any>) => void;
  setHidden: (hide: string) => void;
  hiddenVal?: string;
  setFor: (expr: string, forKey?: string) => void;
  forVal?: string;
  forKey?: string;
  isRoot: boolean;
  props: any;
  selectedNode?: SelectedNodeInfo;
  deleteNode: () => void;
}

export interface SelectedNodeInfo {
  id: string;
  name: string;
  isDeletable: boolean;
}

export const SetterContext = React.createContext<SetterContextType | undefined>(
  undefined
);

SetterContext.displayName = 'SetterContext';
