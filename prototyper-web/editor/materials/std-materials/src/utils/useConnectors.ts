import { useNode } from '@prototyper/core';
import { noop } from 'lodash';

export const useConnectors = (disabled?: boolean) => {
  const {
    connectors: { drag, connect },
  } = useNode();

  return {
    connect: disabled ? noop : connect,
    connectAndDrag: disabled ? noop : (ref) => connect(drag(ref)),
  };
};
