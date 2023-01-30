import { globalPackagesRegistry } from '@prototyper/core';
import stdPackage from '@prototyper/std-materials';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './helloPackage';
import './global.css';

globalPackagesRegistry.addPackage(stdPackage);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
