import { Element, useNode } from '@prototyper/core';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { getReactNode, NodeProvider } from '../../utils/NodeProvider';
import { useConnectors } from '../../utils/useConnectors';
import { useDebounceMemo } from '../../utils/useDebounceMemo';
import { usePlaceholder } from '../../utils/usePlaceholder';

export const DropAreaContainer = styled.div`
  width: 100%;
  min-height: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #4096ff;
  transition: background-color 0.5s;
  border-radius: 6px;
`;

export const DropAreaNode = ({
  children,
  label: labelProp,
  dragoverLabel: dragoverLabelProp,
  direct,
}: PropsWithChildren<{
  label?: NodeProvider;
  dragoverLabel?: NodeProvider;
  direct?: boolean;
}>) => {
  const { dragover } = useNode((state) => ({
    dragover: state.events.dragover,
  }));
  const { connectAndDrag } = useConnectors(direct);
  const labelNode = useDebounceMemo(
    () => {
      const label = labelProp || '请拖入组件';
      const dragoverLabel =
        dragoverLabelProp || (labelProp ? labelProp : '在这里松开!');

      return dragover && dragoverLabel
        ? getReactNode(dragoverLabel)
        : getReactNode(label);
    },
    [dragover],
    250
  );
  return (
    <>
      {usePlaceholder(
        <DropAreaContainer
          ref={connectAndDrag}
          style={{
            backgroundColor: dragover ? '#d9f7be' : undefined,
          }}
        >
          {labelNode}
        </DropAreaContainer>,
        children
      )}
    </>
  );
};

export const DropArea = ({
  children,
  label,
  dragoverLabel,
  id,
}: PropsWithChildren<{
  id?: string;
  label?: NodeProvider;
  dragoverLabel?: NodeProvider;
}>) => {
  if (!id)
    return (
      <DropAreaNode label={label} dragoverLabel={dragoverLabel} direct>
        {children}
      </DropAreaNode>
    );
  return (
    <Element
      is={DropAreaNode}
      id={id}
      label={label}
      dragoverLabel={dragoverLabel}
      canvas
    >
      {children}
    </Element>
  );
};
