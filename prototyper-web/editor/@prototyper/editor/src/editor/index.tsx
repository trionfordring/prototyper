import { ApplicationEditor, ProtoDragger } from '@prototyper/core';
import React, { ComponentProps, forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

import EditorHeader from './header';
import EditorLeft from './leftarea';
import EditorMainContent from './main';
import EditorRight from './rightarea';

const EditorBox = styled.section`
  flex-direction: column;
  flex-wrap: nowrap;
`;

const EditorBody = styled.div`
  flex-grow: 1;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  display: flex;

  & > * {
    height: 100%;
  }
`;

const EditorMain = styled.div`
  flex-grow: 1;
  max-height: 100%;
`;

export const Editor = forwardRef<
  HTMLDivElement,
  PropsWithChildren<
    ComponentProps<typeof ApplicationEditor> & {
      draggers: ProtoDragger[];
    }
  >
>(({ children, draggers, ...props }, ref) => {
  return (
    <EditorBox ref={ref}>
      <ApplicationEditor {...props}>
        <EditorHeader />
        <EditorBody>
          <EditorLeft draggers={draggers} />
          <EditorMain>
            <EditorMainContent>{children}</EditorMainContent>
          </EditorMain>
          <EditorRight />
        </EditorBody>
      </ApplicationEditor>
    </EditorBox>
  );
});
