import { useNode } from '@craftjs/core';
import React from 'react';

import { RecoverComponentContext, useComponentContext } from '../context';

/**
 * @param SlotMode 当正在编辑该父组件(或渲染其父级组件)时，父组件可以往槽中添加节点，此时表现为槽模式(SlotMode)。
 * @param EditSlotMode 当正在编辑当前组件时，插槽体现为一个普通节点，表现为编辑槽模式(EditSlotMode)
 */
export const createSlot = (
  SlotMode: React.ComponentType,
  EditSlotMode: React.ComponentType
) => {
  function Slot(props: any) {
    const { editing, root } = useComponentContext()!;
    const { id: nodeId } = useNode();
    if (editing) {
      return <EditSlotMode {...props} nodeId={nodeId} />;
    }
    if (root) return null;
    return (
      <RecoverComponentContext>
        <SlotMode {...props} nodeId={nodeId} />
      </RecoverComponentContext>
    );
  }
  return Slot;
};
