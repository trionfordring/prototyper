import React from 'react';

import { GetComponentFunc } from '../../app';
import { DefaultPropsType, ProtoComponent } from '../../component';

export interface ApplicationContextType<S = DefaultPropsType> {
  appStates: S;

  currentComponent: ProtoComponent;
  setCurrentComponent: (c: ProtoComponent, props: DefaultPropsType) => void;

  getComponent?: GetComponentFunc;

  editing?: boolean;
  rootProps: DefaultPropsType;
}

export const ApplicationContext = React.createContext<
  ApplicationContextType | undefined
>(undefined);

ApplicationContext.displayName = 'ApplicationContext';
