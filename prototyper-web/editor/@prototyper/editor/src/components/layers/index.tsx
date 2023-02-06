import { Layers as NodeLayers } from '@craftjs/layers';
import React from 'react';
import styled from 'styled-components';

const LayerContainer = styled.div`
  position: relative;
  min-width: 16rem;
  .layer-name h2 {
    margin: 0;
  }

  svg {
    display: block;
  }
`;
export const Layers = () => {
  return (
    <LayerContainer>
      <NodeLayers expandRootOnLoad />
    </LayerContainer>
  );
};
