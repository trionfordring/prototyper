import { ProtoDragger } from '@prototyper/core';
import React from 'react';

export function NativeDragger({ dragger }: { dragger: ProtoDragger }) {
  const NativeComponent = dragger.draggerProps?.renderer;
  if (!NativeComponent) return null;
  return <NativeComponent></NativeComponent>;
}
