import {
  ApplicationRenderer,
  ComponentDescriptor,
  globalPackagesRegistry,
} from '@prototyper/core';
import React from 'react';

function Render1({
  descriptor,
  children,
}: React.PropsWithChildren<{ descriptor?: ComponentDescriptor }>) {
  if (!descriptor) return <>'未指定组件'</>;
  const pkg = globalPackagesRegistry.getPackage(descriptor.namespace);
  const component = pkg.getComponent(descriptor.name);
  if (!component)
    return (
      <>
        `找不到组件${descriptor.namespace}-${descriptor.name}`
      </>
    );
  return (
    <ApplicationRenderer
      app={{
        index: component,
      }}
    >
      {children}
    </ApplicationRenderer>
  );
}

export const Render = React.memo(Render1);
