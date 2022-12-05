import React, { forwardRef, PropsWithChildren } from 'react';

import { ComponentDescriptor, DefaultPropsType } from './ProtoComponent';

export const DefaultComponentWarpper = forwardRef<
  any,
  PropsWithChildren<{
    props: DefaultPropsType;
    className?: string;
    editing?: boolean;
    descriptor?: ComponentDescriptor;
    root?: boolean;
  }>
>(({ children, className, editing, descriptor, root }, ref) => {
  const clazz = ['component'];
  if (root) clazz.push('root');
  if (descriptor) clazz.push(descriptor.namespace, descriptor.name);
  if (className) clazz.push(className);
  if (editing) clazz.push('editing');
  return (
    <div ref={ref} className={clazz.join(' ')}>
      {children}
    </div>
  );
});
