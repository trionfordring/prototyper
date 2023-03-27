import { createSlot, Element, useNode } from '@prototyper/core';
import React from 'react';

import { DropSpanContainer, DropSpanNode } from './DropSpan';

export const SlotSpan = createSlot(
  ({ id, nodeId, name }: { id?: string; nodeId?: string; name?: string }) => {
    const realId = id || nodeId;
    const realName = name || realId;
    return (
      <Element
        is={DropSpanNode}
        id={realId}
        canvas
        custom={{
          displayName: `插槽[${realName}]`,
        }}
        label={`在此插入[${realName}]`}
      ></Element>
    );
  },
  ({ id, nodeId, name }: { id?: string; nodeId?: string; name?: string }) => {
    const realId = id || nodeId;
    const realName = name || realId;
    const {
      connectors: { connect, drag },
    } = useNode();
    return (
      <DropSpanContainer ref={(ref) => connect(drag(ref!))}>
        [插槽 {realName}]
      </DropSpanContainer>
    );
  }
);
