import { StyleProvider, createCache } from '@ant-design/cssinjs';
import { ComponentEditorFrame, createShadow } from '@prototyper/core';
import React, { PropsWithChildren, useMemo, useRef } from 'react';
import styled, { StyleSheetManager } from 'styled-components';

import { NodeToolBar } from '../node/NodeToolBar';

const MainFrame = styled.div`
  width: 100%;
  height: fit-content;
`;
const IndicatorBox = styled.div`
  position: relative;
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
    const indicatorBox = useRef();
    return (
      <Container>
        <StyleProvider container={shadowRoot} cache={cache}>
          <StyleSheetManager target={shadowRoot}>
            <React.Fragment>
              {children}
              <IndicatorBox ref={indicatorBox} />
              <NodeToolBar
                container={() => indicatorBox.current}
                relativePosition
              />
              <ComponentEditorFrame />
            </React.Fragment>
          </StyleSheetManager>
        </StyleProvider>
      </Container>
    );
  }
);

export default EditorMain;
