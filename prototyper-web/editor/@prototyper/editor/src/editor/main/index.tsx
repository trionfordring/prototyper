import { StyleProvider, createCache } from '@ant-design/cssinjs';
import {
  ComponentEditorFrame,
  createShadow,
  useEditor,
} from '@prototyper/core';
import { ConfigProvider } from 'antd';
import { noop } from 'lodash';
import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Rnd, Props as RndProps } from 'react-rnd';
import styled, { StyleSheetManager } from 'styled-components';

import { NodeToolBar } from '../node/NodeToolBar';

const MainFrame = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;
const Padding = styled.div`
  border: 1px solid #f0f0f0;
  padding: 7px;
  height: 100%;
  height: calc(100% - 14px);
`;
const StyledRnd = styled(Rnd)`
  z-index: 5;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%),
    0 2px 4px 0 rgb(0 0 0 / 2%);
`;
const IndicatorBox = styled.div`
  position: relative;
`;
type EditorMainProps = {
  container?: React.ComponentType;

  enableDragging?: boolean;
  position: RndProps['position'];
  setPosition: (pos: RndProps['position']) => void;
  size: RndProps['size'];
  setSize: (size: RndProps['size']) => void;

  onFrameMounted?: (el: HTMLDivElement) => void;
};

const FrameContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .root {
    flex-grow: 1;
  }
`;

const EditorMain = createShadow<HTMLDivElement, EditorMainProps>(
  forwardRef<HTMLDivElement, PropsWithChildren<EditorMainProps>>(
    (
      {
        children,
        enableDragging,
        position,
        setPosition,
        size,
        setSize,
        onFrameMounted = noop,
      },
      ref
    ) => {
      const resizingRect = useRef<DOMRect>();
      const { actions } = useEditor();
      const frameRef = useRef<HTMLDivElement>();
      useEffect(() => {
        onFrameMounted(frameRef.current);
      }, [onFrameMounted]);
      return (
        <StyledRnd
          position={position}
          disableDragging={!enableDragging}
          enableResizing={enableDragging}
          onDragStop={(e, data) => {
            setPosition(data);
          }}
          size={size}
          onResizeStart={(e, dir, ref) => {
            resizingRect.current = ref.getBoundingClientRect();
          }}
          onResize={(e, dir, ref, delta, position) => {
            const rect = resizingRect.current;
            setPosition(position);
            setSize({
              height: rect.height + delta.height,
              width: rect.width + delta.width,
            });
          }}
        >
          <MainFrame
            style={{
              pointerEvents: enableDragging ? 'none' : undefined,
              userSelect: enableDragging ? 'none' : undefined,
              height: '100%',
            }}
            onMouseLeave={() => actions.clearHovered()}
            ref={frameRef}
          >
            <Padding ref={ref}>{children}</Padding>
          </MainFrame>
        </StyledRnd>
      );
    }
  ),
  ({ children, shadowRoot, container }) => {
    return (
      <NodeCanvas shadowRoot={shadowRoot} container={container}>
        {children}
      </NodeCanvas>
    );
  }
);

const NodeCanvas = ({
  children,
  shadowRoot,
  container,
}: PropsWithChildren<{
  shadowRoot: ShadowRoot;
  container: React.ComponentType;
}>) => {
  const Container = container ? container : FrameContainer;
  const popoverContainerRef = useRef<HTMLDivElement>();
  const cache = useMemo(() => {
    return createCache();
  }, []);
  const indicatorBox = useRef();
  return (
    <StyleProvider container={shadowRoot} cache={cache}>
      <StyleSheetManager target={shadowRoot}>
        <>
          <div ref={popoverContainerRef}></div>
          <ConfigProvider
            getPopupContainer={() => popoverContainerRef.current!}
          >
            <Container>
              {children}
              <IndicatorBox ref={indicatorBox} />
              <NodeToolBar
                container={() => indicatorBox.current}
                relativePosition
              />
              <ComponentEditorFrame />
            </Container>
          </ConfigProvider>
        </>
      </StyleSheetManager>
    </StyleProvider>
  );
};

export default EditorMain;
