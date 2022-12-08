import { ProtoDragger } from '@prototyper/core';
import React from 'react';

import { ImgDragger } from './ImgDragger';
import { NativeDragger } from './NativeDragger';

const DRAGGERS: Record<
  string,
  React.ComponentType<{ dragger: ProtoDragger }>
> = {
  img: ImgDragger,
  native: NativeDragger,
};

export function getSupportDraggerByType(type: string) {
  return DRAGGERS[type];
}
