import * as PrototyperCore from '@prototyper/core';
import { globalPackagesRegistry } from '@prototyper/core';
import * as PrototyperEditor from '@prototyper/editor';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import StyledComponent from 'styled-components';

globalPackagesRegistry.registerData('react', React);
globalPackagesRegistry.registerData('react-dom', ReactDOM);
globalPackagesRegistry.registerData('@prototyper/core', PrototyperCore);
globalPackagesRegistry.registerData('@prototyper/editor', PrototyperEditor);
globalPackagesRegistry.registerData('styled-components', StyledComponent);
