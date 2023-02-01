import { useNode, Element } from '@prototyper/core';
import React from 'react';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { getReactNode, NodeProvider } from '../../utils/NodeProvider';
import { useConnectors } from '../../utils/useConnectors';
import { useDebounceMemo } from '../../utils/useDebounceMemo';
import { usePlaceholder } from '../../utils/usePlaceholder';

const DropSpanContainer = styled.span`
  min-width: 1em;
  min-height: 18px;

  border: 1px dashed #4096ff;
  transition: background-color 0.5s;
  border-radius: 3px;
`;

export const DropSpanNode = ({
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
      const label = labelProp || '';
      const dragoverLabel = dragoverLabelProp || (labelProp ? labelProp : '');

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
        <DropSpanContainer
          ref={connectAndDrag}
          style={{
            backgroundColor: dragover ? '#d9f7be' : undefined,
          }}
        >
          {labelNode}
        </DropSpanContainer>,
        children
      )}
    </>
  );
};

export const DropSpan = ({
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
      <DropSpanNode label={label} dragoverLabel={dragoverLabel} direct>
        {children}
      </DropSpanNode>
    );
  return (
    <Element
      is={DropSpanNode}
      id={id}
      label={label}
      dragoverLabel={dragoverLabel}
      canvas
    >
      {children}
    </Element>
  );
};
