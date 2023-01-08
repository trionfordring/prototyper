import { SerializedNode, SerializedNodes } from '@craftjs/core';
import React from 'react';

import {
  ProtoComponent,
  ProtoElementType,
  WithDescriptor,
} from './ProtoComponent';

import { SetterContextProvider } from '../context';

export type CreateProtoComponentType = Omit<ProtoComponent, 'virtualDom'> & {
  virtualDom?:
    | string
    | Record<
        string,
        | SerializedNode
        | Omit<
            SerializedNode,
            | 'parent'
            | 'type'
            | 'props'
            | 'isCanvas'
            | 'displayName'
            | 'linkedNodes'
          >
      >;
};

function buildNativeSettings(settings: ProtoElementType) {
  return (props) => {
    return (
      <SetterContextProvider>
        {React.createElement(
          settings,
          {
            ...props,
          },
          null
        )}
      </SetterContextProvider>
    );
  };
}

export function createProtoComponent(
  protoComponent: CreateProtoComponentType & Partial<WithDescriptor>
): ProtoComponent {
  if (protoComponent.type !== 'virtual') {
    if (protoComponent.settings && protoComponent.component)
      protoComponent.component['craft'] = {
        related: {
          settings: buildNativeSettings(protoComponent.settings),
        },
      };
    return protoComponent as ProtoComponent;
  }
  let vdom = protoComponent.virtualDom as SerializedNodes;
  if (typeof vdom === 'string') {
    vdom = JSON.parse(vdom);
  }
  return {
    ...protoComponent,
    virtualDom: {
      ...vdom,
      ROOT: {
        ...vdom.ROOT,
        props: {},
        isCanvas: true,
        displayName: 'ROOT',
        linkedNodes: {},
        type: {
          resolvedName: 'ComponentRenderer',
        },
      },
    },
  };
}
