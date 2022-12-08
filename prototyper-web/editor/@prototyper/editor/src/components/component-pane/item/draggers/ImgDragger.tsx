import { ProtoDragger } from '@prototyper/core';
import { Image } from 'antd';
import React from 'react';

export function ImgDragger({ dragger }: { dragger: ProtoDragger }) {
  const src = dragger?.draggerProps?.src;
  return <Image src={src}></Image>;
}
