import { SerializedNode, SerializedNodes } from '@craftjs/core';

import { ProtoComponent } from './ProtoComponent';

export function createProtoComponent(
  protoComponent: Omit<ProtoComponent, 'virtualDom'> & {
    virtualDom:
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
  }
): ProtoComponent {
  if (protoComponent.type !== 'virtual') {
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
