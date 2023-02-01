import React, { useMemo } from 'react';

import { NodeRenderer } from '../renderer';

function createOnRender(
  OnRender?: React.ComponentType<{
    render: React.ReactElement;
  }>
): React.ComponentType<{
  render: React.ReactElement;
}> {
  return ({ render }) => {
    return OnRender ? (
      <OnRender render={<NodeRenderer></NodeRenderer>}></OnRender>
    ) : (
      <NodeRenderer></NodeRenderer>
    );
  };
}

export const useNodeRender = (
  OnRender?: React.ComponentType<{
    render: React.ReactElement;
  }>
) => {
  return useMemo(() => createOnRender(OnRender), [OnRender]);
};
