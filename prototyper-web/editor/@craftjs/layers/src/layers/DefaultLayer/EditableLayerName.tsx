import { useEditor } from '@craftjs/core';
import React from 'react';

import { useLayer } from '../useLayer';

export const EditableLayerName = () => {
  const { id } = useLayer();

  const { displayName } = useEditor((state) => ({
    displayName:
      state.nodes[id] && state.nodes[id].data.custom.displayName !== undefined
        ? state.nodes[id]?.data.custom.displayName
        : state.nodes[id].data.displayName,
  }));

  return <h2>{displayName}</h2>;
};
