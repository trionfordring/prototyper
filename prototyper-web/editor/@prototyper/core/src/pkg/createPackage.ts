import { ComponentPackage } from './ComponentPackage';

import { ProtoComponent } from '../component';
import { createProtoComponent } from '../component/createComponent';
import { ProtoDragger } from '../dragger';

export function createPackage(
  namespace: string,
  components?: Record<string, ProtoComponent>
): ComponentPackage {
  const componentsStore = {
    ...components,
  };
  const draggers: ProtoDragger[] = [];
  let meta = {};
  const catalogue = [];
  return {
    namespace,
    components: componentsStore,
    draggers,
    catalogue,
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
    addDragger: (dragger) => {
      if (draggers.some((d) => d.label === dragger.label)) return;
      draggers.push(dragger);
    },
    meta() {
      return meta;
    },
    setMeta(metaFn) {
      if (typeof metaFn === 'function') meta = metaFn(meta);
      meta = metaFn;
    },
    createCategory(name, label, order) {
      const subcategories = [];
      catalogue.push({
        name,
        label,
        order,
        subcategories,
      });
      return {
        addSubcategory(name, label, order) {
          subcategories.push({
            name,
            label,
            order,
          });
        },
      };
    },
  };
}
