import React from 'react';

import { GetComponentFunc } from '../../app';
import {
  DefaultPropsType,
  ProtoComponent,
  WithDescriptor,
} from '../../component';

export interface ApplicationContextType<S = DefaultPropsType> {
  appStates: S;

  currentComponent: ProtoComponent & Partial<WithDescriptor>;
  setCurrentComponent: (
    c: ProtoComponent & Partial<WithDescriptor>,
    props: DefaultPropsType
  ) => void;

  getComponent: GetComponentFunc;

  editing?: boolean;
  rootProps?: DefaultPropsType;
  setRootProps: (props: any) => void;
}

export const ApplicationContext = React.createContext<
  ApplicationContextType | undefined
>(undefined);

ApplicationContext.displayName = 'ApplicationContext';
