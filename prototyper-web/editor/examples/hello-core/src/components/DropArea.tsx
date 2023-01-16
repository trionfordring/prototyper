import { useNode } from '@prototyper/core';
import { FC, PropsWithChildren } from 'react';

export const DropArea: FC<PropsWithChildren> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div
      ref={(ref) => connect(ref as any)}
      style={{
        minHeight: '24px',
      }}
    >
      <span>drop[</span>
      {children ? children : <div>-将组件拖拽到此处-</div>}
      <span>]</span>
    </div>
  );
};
