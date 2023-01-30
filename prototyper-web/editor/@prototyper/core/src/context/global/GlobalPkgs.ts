import { values } from 'lodash';

import { ComponentPackage } from '../../pkg';

export class PackagesRegistry {
  private store: Record<string, ComponentPackage> = {};

  getPackage(namespace: string) {
    return this.store[namespace];
  }

  addPackage(pkg: ComponentPackage) {
    this.store[pkg.namespace] = pkg;
  }

  getAllPackages() {
    return values(this.store);
  }
}

export const globalPackagesRegistry = new PackagesRegistry();

if (typeof window === 'object')
  (window as any).globalPackagesRegistry = globalPackagesRegistry;
