import { ComponentPackage } from './ComponentPackage';

import { ProtoComponent } from '../component';
import { createProtoComponent } from '../component/createComponent';

export function createPackage(
  namespace: string,
  components?: Record<string, ProtoComponent>
): ComponentPackage {
  const componentsStore = {
    ...components,
  };
  const draggers = [];
  return {
    namespace,
    components: componentsStore,
    draggers,
    createComponent: ({ name, ...component }) => {
      const protoComponent = createProtoComponent({
        ...component,
        descriptor: {
          namespace,
          name,
        },
      });
      componentsStore[name] = protoComponent;
    },
    getComponent(name) {
      const ans = componentsStore[name];
      if (!ans) return undefined;
      return {
        ...ans,
        descriptor: {
          namespace,
          name,
        },
      };
    },
    addDragger: (dragger) => draggers.push(dragger),
  };
}
