import { ComponentPackage } from '@prototyper/core';

import { Modal, ModalSettings } from './Modal';

export const setupFeedbackComponents = (pkg: ComponentPackage) => {
  pkg.createComponent({
    type: 'native',
    settings: ModalSettings,
    component: Modal,
    name: 'Modal',
    dependencies: [{ name: 'DropSpan', namespace: pkg.namespace }],
  });
};
