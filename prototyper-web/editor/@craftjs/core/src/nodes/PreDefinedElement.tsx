import React from 'react';

import { NodeElement } from './NodeElement';
import { useInternalNode } from './useInternalNode';

import { useInternalEditor } from '../editor/useInternalEditor';
import { NodeId } from '../interfaces';

export type PreDefinedElementType = {
  id: NodeId;
};

export function PreDefinedElement({ id }: PreDefinedElementType) {
  const { linkedNodeId } = useInternalNode((node) => ({
    linkedNodeId: node.data.linkedNodes[id],
  }));
  const { exist } = useInternalEditor((state) => ({
    exist: !!state.nodes[linkedNodeId],
  }));

  return exist ? <NodeElement id={linkedNodeId} /> : null;
}
