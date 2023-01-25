import React from 'react';

import { GetComponentFunc } from '../../app';
import {
  DefaultPropsType,
  ProtoComponent,
  WithDescriptor,
} from '../../component';
import { PropDeclear } from '../../utils';

export interface ApplicationContextType<S = DefaultPropsType> {
  appStates: S;

  currentComponent: ProtoComponent & Partial<WithDescriptor>;
  setCurrentComponent: (
    c: ProtoComponent & Partial<WithDescriptor>,
    props: DefaultPropsType,
    propsMapper: PropDeclear
  ) => void;

  getComponent: GetComponentFunc;

  editing?: boolean;
  rootProps?: DefaultPropsType;
  rootPropsMapper?: PropDeclear;
  setRootProps: (props: any, propsMapper: PropDeclear) => void;
}

export const ApplicationContext = React.createContext<
  ApplicationContextType | undefined
>(undefined);

ApplicationContext.displayName = 'ApplicationContext';
