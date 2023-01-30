import { useNode } from '@prototyper/core';

export const useConnectors = () => {
  const {
    connectors: { drag, connect },
  } = useNode();

  return {
    connect,
    connectAndDrag: (ref) => connect(drag(ref)),
  };
};
