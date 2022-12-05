import { useNode } from '@prototyper/core';
import { FC } from 'react';
export const Text: FC<{
  textExpr: string;
}> = ({ textExpr }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return <h3 ref={(ref) => connect(drag(ref as HTMLElement))}>{textExpr}</h3>;
};
