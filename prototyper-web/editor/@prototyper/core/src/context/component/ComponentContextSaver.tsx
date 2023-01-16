import { RecoverEditorContext, SaveEditorContext } from '@craftjs/core';
import React, { PropsWithChildren, useContext } from 'react';

import { ComponentContext, ComponentContextType } from './ComponentContext';

const ComponentSaveContext = React.createContext<
  | {
      componentContext: ComponentContextType;
    }
  | undefined
>(undefined);

export const SaveComponentContext = ({ children }: PropsWithChildren) => {
  const componentContext = useContext(ComponentContext);
  return (
    <SaveEditorContext>
      <ComponentSaveContext.Provider
        value={{
          componentContext,
        }}
      >
        {children}
      </ComponentSaveContext.Provider>
    </SaveEditorContext>
  );
};

export const RecoverComponentContext = ({ children }: PropsWithChildren) => {
  const { componentContext } = useContext(ComponentSaveContext);
  return (
    <RecoverEditorContext>
      <ComponentContext.Provider value={componentContext}>
        {children}
      </ComponentContext.Provider>
    </RecoverEditorContext>
  );
};
