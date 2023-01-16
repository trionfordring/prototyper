import { createSlot, Element, useNode } from '@prototyper/core';
import { SetterForm, TextSetter } from '@prototyper/editor';

import { DropArea } from './DropArea';

export const Slot = createSlot(
  ({ id }: { id?: string }) => {
    const { id: nodeId } = useNode();
    return <Element is={DropArea} id={id || nodeId} canvas></Element>;
  },
  () => {
    const {
      connectors: { connect, drag },
    } = useNode();
    return <div ref={(ref) => connect(drag(ref!))}>[SLOT]</div>;
  }
);

export const SlotSettings = () => {
  return (
    <SetterForm>
      <TextSetter
        label="id"
        placeholder="默认id为节点id"
        propName="id"
      ></TextSetter>
    </SetterForm>
  );
};
