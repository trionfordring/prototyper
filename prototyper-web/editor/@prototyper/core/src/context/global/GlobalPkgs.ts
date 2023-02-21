import { values } from 'lodash';

import { ComponentPackage } from '../../pkg';

export class PackagesRegistry {
  private store: Record<string, ComponentPackage> = {};

  private umdMap: Record<string, string> = {};
  private dataMap: Record<string, any> = {};

  getPackage(namespace: string) {
    return this.store[namespace];
  }

  addPackage(pkg: ComponentPackage) {
    this.store[pkg.namespace] = pkg;
  }

  getAllPackages() {
    return values(this.store);
  }

  require(pkgName: string) {
    const ret = this.dataMap[pkgName] || this.umdMap[pkgName];
    if (ret === undefined) throw new Error(`找不到依赖[${pkgName}]`);
    return ret;
  }

  registerUmd(pkgName: string, umdName: string) {
    this.umdMap[pkgName] = umdName;
  }
  registerData(pkgName: string, data: any) {
    this.dataMap[pkgName] = data;
  }
}

export const globalPackagesRegistry = new PackagesRegistry();

// eslint-disable-next-line no-restricted-globals
(self as any).globalPackagesRegistry = globalPackagesRegistry;
