import {
  ComponentPackage,
  globalPackagesRegistry,
  prcessComponentScripts,
} from '@prototyper/core';

import StdNodes from './std.json';

export const setupStd = (pkg: ComponentPackage) => {
  pkg.createComponent(
    prcessComponentScripts(globalPackagesRegistry, StdNodes as any)
  );
};
