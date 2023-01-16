import React, { PropsWithChildren, useContext } from 'react';

import type { EditorContext as EditorContextType } from './EditorContext';
import { EditorContext } from './EditorContext';

import { CoreEventHandlers } from '../events';
import { EventHandlerContext } from '../events/EventContext';
import { NodeContext, NodeContextType } from '../nodes/NodeContext';

const EditorSaveContext = React.createContext<
  | {
      editorContext: EditorContextType;
      eventHandlerContext: CoreEventHandlers;
      nodeContext: NodeContextType;
    }
  | undefined
>(undefined);

export const SaveEditorContext = ({ children }: PropsWithChildren) => {
  const editorContext = React.useContext(EditorContext);
  const eventHandlerContext = React.useContext(EventHandlerContext);
  const nodeContext = React.useContext(NodeContext);

  return (
    <EditorSaveContext.Provider
      value={{
        editorContext,
        eventHandlerContext,
        nodeContext,
      }}
    >
      {children}
    </EditorSaveContext.Provider>
  );
};

export const RecoverEditorContext = ({ children }: PropsWithChildren) => {
  const { editorContext, eventHandlerContext, nodeContext } =
    useContext(EditorSaveContext);

  return (
    <EditorContext.Provider value={editorContext}>
      <EventHandlerContext.Provider value={eventHandlerContext}>
        <NodeContext.Provider value={nodeContext}>
          {children}
        </NodeContext.Provider>
      </EventHandlerContext.Provider>
    </EditorContext.Provider>
  );
};
