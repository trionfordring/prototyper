import React from 'react';

import { PropDeclear } from '../../utils';

export interface SetterContextType {
  name: string;
  setName: (name: string) => void;
  setProps: (props: Record<string, any>, propsMapper?: PropDeclear) => void;
  setHidden: (hide: string) => void;
  hiddenVal?: string;
  setFor: (expr: string, forKey?: string) => void;
  forVal?: string;
  forKey?: string;
  isRoot: boolean;
  props: any;
  propsMapper?: PropDeclear;
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
