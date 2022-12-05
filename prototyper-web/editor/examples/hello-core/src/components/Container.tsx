import { useNode } from '@prototyper/core';
import { FC, PropsWithChildren } from 'react';

export const Container: FC<
  PropsWithChildren<{
    color?: string;
  }>
> = ({ children, color }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      ref={(ref) => connect(drag(ref as HTMLElement))}
      style={{
        minHeight: '24px',
        backgroundColor: color,
      }}
    >
      {children}
    </div>
  );
};
