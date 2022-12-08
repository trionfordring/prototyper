import { ProtoDragger } from '@prototyper/core';
import React from 'react';
import styled from 'styled-components';

import { ComponentPaneItem } from './item';

const Pane = styled.section`
  width: 16rem;
  min-width: 200px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export function ComponentPane({ draggers }: { draggers: ProtoDragger[] }) {
  return (
    <Pane>
      {draggers.map((d) => (
        <ComponentPaneItem
          dragger={d}
          key={`${d.descriptor.namespace}.${d.descriptor.name}`}
        />
      ))}
    </Pane>
  );
}
