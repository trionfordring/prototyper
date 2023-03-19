import { ComponentDescriptor } from '@prototyper/core';
import React from 'react';
import ReactDom from 'react-dom/client';

import { Render } from './render';

class PrototyperPreviewer {
  render(dom: HTMLElement, descriptor: ComponentDescriptor) {
    const root = ReactDom.createRoot(dom);
    root.render(React.createElement(Render, { descriptor }));
    return root;
  }
}

const previewer = new PrototyperPreviewer();

export default previewer;
