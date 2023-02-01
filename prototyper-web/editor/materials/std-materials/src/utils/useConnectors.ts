import { useNode } from '@prototyper/core';

export const useConnectors = (disabled?: boolean) => {
  const {
    connectors: { drag, connect },
  } = useNode();

  return {
    connect: disabled ? undefined : connect,
    connectAndDrag: disabled ? undefined : (ref) => connect(drag(ref)),
  };
};
