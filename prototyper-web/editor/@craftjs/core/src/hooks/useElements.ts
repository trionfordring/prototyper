import { ERROR_TOP_LEVEL_ELEMENT_NO_ID } from '@craftjs/utils';
import React, { useEffect } from 'react';
import invariant from 'tiny-invariant';

import { useInternalEditor } from '../editor/useInternalEditor';
import { NodeTree } from '../interfaces';
import { Element } from '../nodes';
import { useInternalNode } from '../nodes/useInternalNode';

export function useElements(elements: Element<any>[]) {
  const { query, actions } = useInternalEditor();
  const { node, inNodeContext } = useInternalNode((node) => ({
    node: {
      id: node.id,
      data: node.data,
    },
  }));
  useEffect(() => {
    if (!inNodeContext) return;
    const { id: nodeId, data } = node;
    const treeList: {
      id: string;
      treeProvider: () => NodeTree;
      cache: boolean;
    }[] = [];
    elements.forEach(({ id, children, ...elementProps }) => {
      invariant(!!id, ERROR_TOP_LEVEL_ELEMENT_NO_ID);
      const existingNode =
        data.linkedNodes &&
        data.linkedNodes[id] &&
        query.node(data.linkedNodes[id]).get();
      if (existingNode && existingNode.data.type === elementProps.is) {
        treeList.push({
          cache: true,
          treeProvider: () => null,
          id,
        });
        return;
      }
      const linkedElement = React.createElement(
        Element,
        elementProps,
        children
      );

      treeList.push({
        cache: false,
        treeProvider: () => query.parseReactElement(linkedElement).toNodeTree(),
        id,
      });
    });
    actions.history.ignore().setLinkedNodeFromTree(nodeId, treeList);
  }, [actions.history, elements, inNodeContext, node, query]);
}
