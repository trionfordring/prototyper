import {
  ComponentRenderer,
  globalPackagesRegistry,
  Element,
} from '@prototyper/core';
import React from 'react';

export type NodeDescriptor = {
  namespace: string;
  name: string;
  props?: any;
  mapper?: any;
};

export function renderNode(
  id: string,
  descriptor: NodeDescriptor
): React.ReactNode {
  const pkg = globalPackagesRegistry.getPackage(descriptor.namespace);
  const component = pkg?.getComponent(descriptor.name);
  if (!component) return null;
  if (component.type === 'virtual')
    return (
      <Element
        key={id}
        id={id}
        is={ComponentRenderer}
        props={descriptor.props}
        descriptor={descriptor}
        custom={{
          propsMapper: descriptor.mapper,
        }}
      />
    );
  else
    return (
      <Element
        {...descriptor.props}
        key={id}
        id={id}
        is={component.component}
        custom={{
          propsMapper: descriptor.mapper,
        }}
      />
    );
}
