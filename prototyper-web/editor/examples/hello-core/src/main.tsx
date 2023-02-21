import { globalPackagesRegistry } from '@prototyper/core';
import stdPackage from '@prototyper/std-materials';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './helloPackage';
import './setup/setupMonaco';
import './global';
import './global.css';

globalPackagesRegistry.addPackage(stdPackage);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
