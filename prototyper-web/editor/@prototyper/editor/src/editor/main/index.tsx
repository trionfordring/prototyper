import { ComponentEditorFrame, createShadow } from '@prototyper/core';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const MainFrame = styled.div`
  width: 100%;
  height: fit-content;
`;

const EditorMain = createShadow(
  MainFrame,
  ({ children }: PropsWithChildren) => {
    return (
      <React.Fragment>
        {children}
        <ComponentEditorFrame />
      </React.Fragment>
    );
  }
);

export default EditorMain;
