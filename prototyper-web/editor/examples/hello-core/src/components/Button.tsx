import { useNode } from '@prototyper/core';
import { SetterForm, TextSetter } from '@prototyper/editor';
import React, { FC } from 'react';

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

export const ButtonSettings = () => {
  return (
    <SetterForm>
      <TextSetter propName="textExpr" label="文字"></TextSetter>
      <TextSetter propName="onClick" label="当点击时"></TextSetter>
    </SetterForm>
  );
};
