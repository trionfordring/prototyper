import { NodeElement, NodeId, useNode } from '@craftjs/core';
import React from 'react';
import { useMemo } from 'react';

export const useNodeChildren = () => {
  const { nodeChildren, nodes } = useNode((node) => ({
    nodeChildren: node.data.props.children,
    nodes: node.data.nodes,
  }));
  const children = useMemo(() => {
    let ans = nodeChildren;
    if (nodes && nodes.length > 0) {
      ans = nodes.map((id: NodeId) => <NodeElement id={id} key={id} />);
    }
    return ans;
  }, [nodeChildren, nodes]);
  return children;
};
