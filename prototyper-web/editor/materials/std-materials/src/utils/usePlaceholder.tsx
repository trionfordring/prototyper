import { useComponentContext } from '@prototyper/core';

import { NodeProvider, getReactNode } from './NodeProvider';

export const usePlaceholder = (
  editorPlaceholderProvider: NodeProvider,
  contentProvider?: NodeProvider,
  renderPlaceholderProvider?: NodeProvider
) => {
  const { editing } = useComponentContext();
  const content = getReactNode(contentProvider);
  if (content !== null && content !== undefined && content !== '')
    return content;
  return getReactNode(
    editing ? editorPlaceholderProvider : renderPlaceholderProvider
  );
};
