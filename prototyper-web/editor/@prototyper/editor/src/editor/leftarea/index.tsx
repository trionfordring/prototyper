import { ProtoDragger } from '@prototyper/core';
import React from 'react';

import { ComponentPane } from '../../components/component-pane';

const EditorLeft = ({ draggers }: { draggers: ProtoDragger[] }) => {
  return <ComponentPane draggers={draggers}></ComponentPane>;
};

export default EditorLeft;
