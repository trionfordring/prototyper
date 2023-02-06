import { ApplicationEditor, ProtoDragger } from '@prototyper/core';
import React, {
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Props as RndProps } from 'react-rnd';
import styled from 'styled-components';

import EditorHeader from './header';
import EditorLeft from './leftarea';
import EditorMainContent from './main';
import { CanvasMode, ModeSlider } from './main/ModeSlider';
import EditorRight from './rightarea';

const EditorBox = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
`;

const EditorBody = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  background-color: #f5f5f5;

  overflow: hidden;
`;

const EditorMain = styled.div`
  flex-grow: 1;
  min-height: 1px;
  height: calc(100% - 45px);
  position: relative;
  margin: 15px;
`;

export const Editor = forwardRef<
  HTMLDivElement,
  PropsWithChildren<
    ComponentProps<typeof ApplicationEditor> & {
      draggers: ProtoDragger[];
      container?: React.ComponentType;
    }
  >
>(({ children, draggers, container, ...props }, ref) => {
  const [mode, setMode] = useState<CanvasMode>('edit');
  const [position, setPosition] = useState<RndProps['position']>({
    x: 0,
    y: 0,
  });
  const [size, setSize] = useState<RndProps['size']>({
    height: 'auto',
    width: '100%',
  });
  const mainRef = useRef<HTMLDivElement>();
  const resetCanvas = useCallback(() => {
    setPosition({
      x: 0,
      y: 0,
    });
    const dom = mainRef.current;
    if (dom) {
      const { height, width } = dom.getBoundingClientRect();
      setSize({
        height,
        width,
      });
    }
  }, []);
  useEffect(() => {
    resetCanvas();
  }, [resetCanvas]);
  return (
    <EditorBox ref={ref}>
      <ApplicationEditor
        {...props}
        disabled={props.disabled || mode !== 'edit'}
      >
        <EditorHeader size={size} setSize={setSize} />
        <EditorBody>
          <EditorLeft draggers={draggers} />
          <ModeSlider mode={mode} setMode={setMode} />
          <EditorMain ref={mainRef}>
            <EditorMainContent
              position={position}
              setPosition={setPosition}
              container={container}
              enableDragging={mode === 'drag'}
              size={size}
              setSize={setSize}
            >
              {children}
            </EditorMainContent>
          </EditorMain>
          <EditorRight />
        </EditorBody>
      </ApplicationEditor>
    </EditorBox>
  );
});
