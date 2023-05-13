import { ComponentPackage } from '@prototyper/core';

import { ImageSettings, Image } from './Image';

export const setupDisplayComponents = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: ImageSettings,
    component: Image,
    name: 'Image',
  });
};
