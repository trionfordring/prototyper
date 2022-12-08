import React from 'react';

import {
  DefaultMataType,
  DefaultPropsType,
  DefaultStatesType,
  ProtoComponent,
  WithDescriptor,
} from '../../component/ProtoComponent';

export interface ComponentContextType<
  P = DefaultPropsType,
  S = DefaultStatesType,
  M = DefaultMataType
> {
  // 由组件的meta()在组件加载后产生
  meta: M;
  // 由组件在创建时由父组件传入
  props: P;
  // 由组件的useState(props)在运行时产生
  state: S;

  component: ProtoComponent & Partial<WithDescriptor>;
  editing?: boolean;
  root?: boolean;
}

export const ComponentContext = React.createContext<
  ComponentContextType | undefined
>(undefined);

ComponentContext.displayName = 'ComponentContext';
