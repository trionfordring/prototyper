import { StyleProvider, createCache } from '@ant-design/cssinjs';
import { ComponentEditorFrame, createShadow } from '@prototyper/core';
import React, { PropsWithChildren, useMemo } from 'react';
import styled, { StyleSheetManager } from 'styled-components';

import { NodeToolBar } from '../node/NodeToolBar';

const MainFrame = styled.div`
  width: 100%;
  height: fit-content;
`;
const EditorMain = createShadow<
  HTMLDivElement,
  {
    container?: React.ComponentType;
  }
>(
  MainFrame,
  ({
    children,
    shadowRoot,
    container,
  }: PropsWithChildren<{
    container: React.ComponentType;
    shadowRoot: ShadowRoot;
  }>) => {
    const Container = container ? container : React.Fragment;
    const cache = useMemo(() => {
      return createCache();
    }, []);
    return (
      <Container>
        {children}
        <NodeToolBar />
        <StyleProvider container={shadowRoot} cache={cache}>
          <StyleSheetManager target={shadowRoot}>
            <ComponentEditorFrame />
          </StyleSheetManager>
        </StyleProvider>
      </Container>
    );
  }
);

export default EditorMain;
