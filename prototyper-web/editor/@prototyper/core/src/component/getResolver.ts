import { Resolver } from '@craftjs/core';
import { mapValues, values } from 'lodash';

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

export function getResolver(
  descriptors: ComponentDescriptor[] = [],
  componentGetter: GetComponentFunc = defaultCompGetter
): Resolver {
  return (descriptors || []).reduce((resolver, desc) => {
    const comp = (componentGetter || defaultCompGetter)(desc);
    resolver[`${comp.descriptor.namespace}.${comp.descriptor.name}`] =
      comp.component;
    return resolver;
  }, {});
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
