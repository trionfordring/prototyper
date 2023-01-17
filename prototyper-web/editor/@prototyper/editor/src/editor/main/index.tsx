import { ComponentEditorFrame, createShadow } from '@prototyper/core';
import React from 'react';
import styled, { StyleSheetManager } from 'styled-components';

const MainFrame = styled.div`
  width: 100%;
  height: fit-content;
`;

const EditorMain = createShadow(MainFrame, ({ children, shadowRoot }) => {
  return (
    <React.Fragment>
      {children}
      <StyleSheetManager target={shadowRoot}>
        <ComponentEditorFrame />
      </StyleSheetManager>
    </React.Fragment>
  );
});

export default EditorMain;
