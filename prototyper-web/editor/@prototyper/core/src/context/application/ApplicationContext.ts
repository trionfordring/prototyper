import React from 'react';

import { GetComponentFunc } from '../../app';
import {
  DefaultPropsType,
  ProtoComponent,
  WithDescriptor,
} from '../../component';
import { PropDeclear, Setter } from '../../utils';

export interface ApplicationContextType<S = DefaultPropsType> {
  baseurl?: string;
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
  setRootMeta: (meta: Setter) => void;

  onRender?: React.ComponentType<{
    render: React.ReactElement;
  }>;
}

export const ApplicationContext = React.createContext<
  ApplicationContextType | undefined
>(undefined);

ApplicationContext.displayName = 'ApplicationContext';
