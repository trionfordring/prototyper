import { ProtoDragger } from '@prototyper/core';
import React from 'react';
import styled from 'styled-components';

import { ComponentPaneItem } from './item';

const Pane = styled.section`
  width: 16rem;
  min-width: 200px;
  height: 100%;

  overflow-x: hide;
  overflow-y: auto;
`;

const Components = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export function ComponentPane({ draggers }: { draggers: ProtoDragger[] }) {
  return (
    <Pane>
      <Components>
        {draggers.map((d) => (
          <ComponentPaneItem
            dragger={d}
            key={`${d.descriptor.namespace}.${d.descriptor.name}`}
          />
        ))}
      </Components>
    </Pane>
  );
}
