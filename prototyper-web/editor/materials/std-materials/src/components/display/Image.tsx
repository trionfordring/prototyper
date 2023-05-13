import {
  BoolSetter,
  EventSetter,
  HTMLSetter,
  SetterForm,
  TextSetter,
} from '@prototyper/editor';
import { Image as AntImage } from 'antd';
import React from 'react';

import { useConnectors } from '../../utils/useConnectors';

export function Image(props) {
  const { connectAndDrag } = useConnectors();
  return (
    <div
      style={{
        display: 'inline-block',
      }}
      className="img"
      ref={connectAndDrag}
    >
      <AntImage {...props} />
    </div>
  );
}

export function ImageSettings() {
  return (
    <SetterForm>
      <TextSetter propName="src" label="src" />
      <TextSetter propName="alt" label="图像描述" />
      <TextSetter propName="fallback" label="fallback" />
      <TextSetter propName="height" label="高度" jsOnly singleLine />
      <TextSetter propName="width" label="宽度" jsOnly singleLine />
      <BoolSetter propName="placeholder" label="加载占位" />
      <BoolSetter propName="preview" label="大图浏览" />
      <HTMLSetter />
      <EventSetter />
    </SetterForm>
  );
}
