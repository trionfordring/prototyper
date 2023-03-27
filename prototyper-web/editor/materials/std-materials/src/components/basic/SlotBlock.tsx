import {
  createSlot,
  Element,
  useNode,
  useSetterContext,
} from '@prototyper/core';
import { SetterForm, TextSetter } from '@prototyper/editor';
import React from 'react';

import { DropAreaContainer, DropAreaNode } from './DropArea';

export const SlotBlock = createSlot(
  ({ id, nodeId, name }: { id?: string; nodeId?: string; name?: string }) => {
    const realId = id || nodeId;
    const realName = name || realId;
    return (
      <Element
        is={DropAreaNode}
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
      <DropAreaContainer ref={(ref) => connect(drag(ref!))}>
        块级插槽[{realName}]
      </DropAreaContainer>
    );
  }
);

export const SlotSettings = () => {
  const { selectedNode } = useSetterContext();
  return (
    <SetterForm>
      <TextSetter
        label="id"
        placeholder={`默认id为节点id[${selectedNode?.id}]`}
        propName="id"
      ></TextSetter>
      <TextSetter
        label="name"
        placeholder={`默认name为节点id`}
        propName="name"
      />
    </SetterForm>
  );
};
