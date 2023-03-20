import { Resolver } from '@craftjs/core';
import { mapValues, merge, values } from 'lodash';

import {
  ComponentDescriptor,
  ProtoComponent,
  WithDescriptor,
} from './ProtoComponent';

import { GetComponentFunc } from '../app/ProtoApplication';
import { globalPackagesRegistry } from '../context';
import { ComponentPackage } from '../pkg';

export const defaultCompGetter: GetComponentFunc = (desc) => {
  const pkg = globalPackagesRegistry?.getPackage(desc.namespace);
  const comp = pkg && pkg.components && pkg.components[desc.name];
  return (
    comp && {
      ...comp,
      descriptor: desc,
    }
  );
};

function getComponentFullName(descriptor: ComponentDescriptor) {
  return `${descriptor.namespace}.${descriptor.name}`;
}

function getComponents(
  descriptor: ComponentDescriptor,
  componentGetter: GetComponentFunc = defaultCompGetter
) {
  const root = componentGetter(descriptor);
  if (!root) {
    console.log('[warn]找不到依赖列表中的虚拟组件', descriptor);
    return {};
  }
  const ans: Record<string, any> = {};
  const contain = (desc: ComponentDescriptor) =>
    ans[getComponentFullName(desc)];
  const add = (
    desc: ComponentDescriptor,
    comp: ProtoComponent & WithDescriptor
  ) => {
    ans[getComponentFullName(desc)] = comp.component;
  };
  if (root.type === 'native') add(descriptor, root);
  const searchDeps = (descriptors: ComponentDescriptor[] = []) => {
    descriptors
      .filter((desc) => !contain(desc))
      .map(componentGetter)
      .filter((comp) => comp?.type === 'native')
      .forEach((comp) => {
        add(comp.descriptor, comp);
        searchDeps(comp.dependencies);
      });
  };
  searchDeps(root.dependencies);
  return ans;
}

export function getResolver(
  descriptors: ComponentDescriptor[] = [],
  componentGetter: GetComponentFunc = defaultCompGetter
): Resolver {
  return (descriptors || [])
    .map((desc) => getComponents(desc, componentGetter))
    .reduce(merge, {});
}

export function getResolverFromPkgs(...pkgs: ComponentPackage[]): Resolver {
  return pkgs
    .flatMap((pkg) =>
      values(
        mapValues(
          pkg.components,
          (v, k) =>
            ({
              ...v,
              descriptor: { namespace: pkg.namespace, name: k },
            } as ProtoComponent & WithDescriptor)
        )
      ).filter((c) => c && c.type === 'native')
    )
    .reduce((resolver, comp) => {
      resolver[`${comp.descriptor.namespace}.${comp.descriptor.name}`] =
        comp.component;
      return resolver;
    }, {});
}
