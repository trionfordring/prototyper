import { useNode } from '@craftjs/core';
import React from 'react';

import { useComponentContext } from '../context';

export const RenderError = ({ msg }: { msg: string }) => {
  const { editing } = useComponentContext();
  const {
    connectors: { drag, connect },
  } = useNode();
  return (
    <div
      ref={(ref) => {
        if (editing) return drag(connect(ref));
        return connect(ref);
      }}
      className="render-error"
    >
      {msg}
    </div>
  );
};
