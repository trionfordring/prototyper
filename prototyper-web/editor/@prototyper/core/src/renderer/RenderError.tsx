import { useNode } from '@craftjs/core';
import React from 'react';

import { useComponentContext } from '../context';

export const RenderError = ({
  msg,
  withPrefix,
}: {
  msg: string;
  withPrefix?: boolean;
}) => {
  const { editing } = useComponentContext();
  const {
    connectors: { drag, connect },
    name,
  } = useNode((node) => ({ name: node.data.displayName }));
  return (
    <div
      ref={(ref) => {
        if (editing) return drag(connect(ref));
        return connect(ref);
      }}
      className="render-error"
    >
      {withPrefix ? `[节点${name}]` : null}
      {msg}
    </div>
  );
};
