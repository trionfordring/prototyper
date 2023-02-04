import { useEditor, ROOT_NODE } from '@prototyper/core';
import React from 'react';

import { NodeIndicator } from './NodeIndicator';
import { NodeIndicatorDescriptor } from './utils/NodeIndicatorDescriptor';

import { Provider } from '../../utils/Provider';

export const NodeToolBar = ({
  container,
  relativePosition,
}: {
  container: Provider<HTMLElement>;
  relativePosition?: boolean;
}) => {
  const { activeNodes, actions, rootDom, connectors } = useEditor(
    (state, query) => {
      const rootDom: HTMLElement = state.nodes[ROOT_NODE]?.dom;
      function getByIds(
        ids: Iterable<string>,
        state: 'hovered' | 'selected'
      ): NodeIndicatorDescriptor[] {
        if (!rootDom) return [];
        return Array.from(ids)
          .map((id) => query.node(id).get())
          .filter((node) => node)
          .map((node) => ({
            id: node.id,
            name: node.data.displayName,
            state,
            remove: query.node(node.id).isDeletable()
              ? () => actions.delete(node.id)
              : undefined,
            selectParent: node.data.parent
              ? () => actions.selectNode(node.data.parent)
              : undefined,
            drag: query.node(node.id).isDraggable()
              ? (ref) => connectors.drag(ref, node.id)
              : undefined,
          }));
      }
      const selected = getByIds(state.events.selected, 'selected');
      const hovered = getByIds(
        Array.from(state.events.hovered).filter(
          (n) => !selected.some((s) => s.id === n)
        ),
        'hovered'
      );
      const activeNodes = [...selected, ...hovered].sort((a, b) =>
        a.id.localeCompare(b.id)
      );
      return { activeNodes, rootDom };
    }
  );
  return (
    <React.Fragment>
      {activeNodes.flatMap((node) => {
        return (
          <NodeIndicator
            node={node}
            key={node.id}
            queryRoot={rootDom}
            container={container}
            relativePosition={relativePosition}
            toolBar={node.state === 'selected'}
          />
        );
      })}
    </React.Fragment>
  );
};
