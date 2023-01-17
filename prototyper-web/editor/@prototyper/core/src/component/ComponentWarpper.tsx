import React, { forwardRef, PropsWithChildren, RefAttributes } from 'react';

import { ProtoWarpperProps } from './ProtoComponent';

const DefaultDiv = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ProtoWarpperProps>
>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
});

export const ComponentWarpper = forwardRef<
  any,
  PropsWithChildren<
    {
      render?: React.ElementType<ProtoWarpperProps>;
    } & ProtoWarpperProps
  >
>(({ children, className, editing, descriptor, root, render, props }, ref) => {
  const clazz = ['component'];
  if (root) clazz.push('root');
  if (descriptor) clazz.push(descriptor.namespace, descriptor.name);
  if (className) clazz.push(className);
  if (editing) clazz.push('editing');
  const RealRender = (render || DefaultDiv) as React.ComponentType<
    PropsWithChildren<ProtoWarpperProps> & RefAttributes<any>
  >;
  return (
    <RealRender
      ref={ref}
      className={clazz.join(' ')}
      root={root}
      editing={editing}
      props={props}
      descriptor={descriptor}
    >
      {children}
    </RealRender>
  );
});
