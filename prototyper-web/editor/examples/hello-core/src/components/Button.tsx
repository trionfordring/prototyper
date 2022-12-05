import { useNode } from '@prototyper/core';
import { FC } from 'react';

export const Button: FC<{
  textExpr: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ textExpr, onClick }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <button
      type="button"
      ref={(ref) => connect(drag(ref as HTMLElement))}
      onClick={onClick}
    >
      {textExpr}
    </button>
  );
};
