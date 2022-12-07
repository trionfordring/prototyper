import { ApplicationEditor } from '@prototyper/core';
import React, { ComponentProps, forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

import EditorHeader from './header';
import EditorLeft from './leftarea';
import EditorMainContent from './main';
import EditorRight from './rightarea';

const EditorBox = styled.div.attrs({
  height: '100vh' as string | number,
})`
  position: fixed;
  display: flex;
  height: ${(props) => props.height};
  width: 100%;
  overflow: hidden;
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
      height?: string | number;
    }
  >
>(({ children, height, ...props }, ref) => {
  return (
    <EditorBox ref={ref} height={height}>
      <ApplicationEditor {...props}>
        <EditorHeader
          descriptor={props.app.indexDescriptor}
          component={props.app.index}
        ></EditorHeader>
        <EditorBody>
          <EditorLeft />
          <EditorMain>
            <EditorMainContent>{children}</EditorMainContent>
          </EditorMain>
          <EditorRight />
        </EditorBody>
      </ApplicationEditor>
    </EditorBox>
  );
});
