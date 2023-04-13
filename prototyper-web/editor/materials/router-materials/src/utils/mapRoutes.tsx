import {
  ComponentRenderer,
  Element,
  globalPackagesRegistry,
} from '@prototyper/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { RouteObject } from 'react-router-dom';

export type NodeDescriptor = {
  namespace: string;
  name: string;
  props?: any;
  mapper?: any;
};
export type PRouterObjects = (Omit<RouteObject, 'children'> &
  Partial<{
    descriptor: NodeDescriptor;
    children: PRouterObjects;
  }>)[];

export function mapNodeDescriptor(
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

export function mapRoutes(routes: PRouterObjects): RouteObject[] {
  return routes.map((r) => {
    let element = r.element;
    if (r.descriptor) {
      const descriptor = r.descriptor;
      element = <>{mapNodeDescriptor(`route:${r.id || r.path}`, descriptor)}</>;
    }
    let children;
    if (r.children && !isEmpty(r.children)) {
      children = mapRoutes(r.children);
    }
    return { ...r, element, children };
  });
}
