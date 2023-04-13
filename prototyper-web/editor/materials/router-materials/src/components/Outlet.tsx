import { useApplicationContext } from '@prototyper/core';
import { SetterForm } from '@prototyper/editor';
import React from 'react';
import { Outlet as Ol } from 'react-router-dom';

import { Box } from './Routes';

import { useConnectors } from '../utils/useConnectors';

export function Outlet() {
  const { connectAndDrag } = useConnectors();
  const { editing } = useApplicationContext();
  if (editing) {
    return <Box ref={connectAndDrag}>子路由节点</Box>;
  }
  return <Ol />;
}

export function OutletSettings() {
  return <SetterForm />;
}
