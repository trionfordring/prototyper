import { useEditor } from '@prototyper/core';
import React, { useEffect } from 'react';

export const NodeSettings = ({
  onSelected,
}: {
  onSelected?: (node?: { id: string; name: string; settings: any }) => void;
}) => {
  const { selected } = useEditor((state) => {
    let [currentNodeId] = state.events.selected;
    let selected;

    while (currentNodeId && !(selected && selected.settings)) {
      const node = state.nodes[currentNodeId];
      selected = {
        id: currentNodeId,
        name: node.data.name,
        settings: node.related && node.related.settings,
      };
      currentNodeId = node.data.parent;
    }
    return {
      selected,
    };
  });
  useEffect(() => {
    if (onSelected) {
      if (selected && selected.id !== 'ROOT') onSelected(selected);
      else onSelected(null);
    }
  }, [selected, onSelected]);
  return selected?.settings && selected.id !== 'ROOT' ? (
    React.createElement(selected.settings)
  ) : (
    <span>点击左侧画板选择一个节点</span>
  );
};
