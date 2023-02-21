import { SerializedNodes } from '@craftjs/core';
import React, { RefAttributes } from 'react';

import { ProtoExprContext } from '../hook/useProtoExprContext';

export type DefaultPropsType = any;
export type DefaultStatesType = any;
export type DefaultMataType = any;

export type ProtoElementType<P = DefaultPropsType> = React.ComponentType<P>;

export type UseSetupStates<
  P = DefaultPropsType,
  S = DefaultStatesType,
  M = DefaultMataType
> = (props: P, mata: M) => S;

export interface ProtoWarpperProps<P = DefaultPropsType> {
  props: P;
  className?: string;
  editing?: boolean;
  descriptor?: ComponentDescriptor;
  root?: boolean;
}

export interface ProtoComponent<
  P = DefaultPropsType,
  S = DefaultStatesType,
  M = DefaultMataType
> {
  type: 'virtual' | 'native';

  warpper?: ProtoElementType<ProtoWarpperProps<P> & RefAttributes<any>>;
  className?: string;

  settings?: ProtoElementType;

  component?: ProtoElementType<P>;

  virtualDom?: string | SerializedNodes;
  dependencies?: ComponentDescriptor[];
  mapProps?: (props: DefaultPropsType, context: ProtoExprContext) => P;
  /**
   * 仅virtual组件可以使用该属性
   */
  useSetupStates?: UseSetupStates<P, S, M>;
  meta?: M;
}

export interface ComponentDescriptor {
  namespace: string;
  name: string;
}
export interface WithDescriptor {
  descriptor: ComponentDescriptor;
}
