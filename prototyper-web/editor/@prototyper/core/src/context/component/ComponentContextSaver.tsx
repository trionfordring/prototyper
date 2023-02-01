import { RecoverEditorContext, SaveEditorContext } from '@craftjs/core';
import React, { PropsWithChildren, useContext } from 'react';

import { ComponentContext, ComponentContextType } from './ComponentContext';

const ComponentSaveContext = React.createContext<
  | {
      componentContext: ComponentContextType;
    }
  | undefined
>(undefined);

const SaveComponentContext1 = ({ children }: PropsWithChildren) => {
  const componentContext = useContext(ComponentContext);
  return (
    <ComponentSaveContext.Provider
      value={{
        componentContext,
      }}
    >
      {children}
    </ComponentSaveContext.Provider>
  );
};

const RecoverComponentContext1 = ({ children }: PropsWithChildren) => {
  const { componentContext } = useContext(ComponentSaveContext);
  return (
    <ComponentContext.Provider value={componentContext}>
      {children}
    </ComponentContext.Provider>
  );
};

export const SaveComponentContext = ({ children }: PropsWithChildren) => {
  return (
    <SaveEditorContext>
      <SaveComponentContext1>{children}</SaveComponentContext1>
    </SaveEditorContext>
  );
};

export const RecoverComponentContext = ({ children }: PropsWithChildren) => {
  return (
    <RecoverEditorContext>
      <RecoverComponentContext1>{children}</RecoverComponentContext1>
    </RecoverEditorContext>
  );
};
