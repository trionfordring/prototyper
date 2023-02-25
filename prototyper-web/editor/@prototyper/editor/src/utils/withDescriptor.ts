import { ComponentDescriptor } from '@prototyper/core';

export function withDescriptor(desc: ComponentDescriptor) {
  return {
    toString() {
      return `${desc.namespace}.${desc.name}`;
    },
  };
}
