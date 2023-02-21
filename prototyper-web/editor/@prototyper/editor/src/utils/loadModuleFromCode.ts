import { globalPackagesRegistry } from '@prototyper/core';

export function loadModuleFromCode(code: string) {
  // eslint-disable-next-line no-new-func
  return new Function('require', code).call(
    this,
    globalPackagesRegistry.require.bind(globalPackagesRegistry)
  );
}
