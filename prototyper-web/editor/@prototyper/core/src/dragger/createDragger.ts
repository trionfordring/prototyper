import merge from 'lodash/merge';

import { ProtoDragger } from './ProtoDragger';

type NativeDraggerOptions = Omit<ProtoDragger, 'type' | 'draggerProps'> & {
  renderer: React.ElementType;
};
export function createNativeDragger({
  renderer,
  ...options
}: NativeDraggerOptions): ProtoDragger {
  return merge({
    draggerProps: {
      renderer,
    },
    options,
  });
}

type ImgDraggerOptions = Omit<ProtoDragger, 'type' | 'draggerProps'> & {
  src: string;
};
export function createImgDragger({
  src,
  ...options
}: ImgDraggerOptions): ProtoDragger {
  return merge({
    draggerProps: {
      src,
    },
    options,
  });
}
