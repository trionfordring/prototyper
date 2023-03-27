import { values } from 'lodash';
import React from 'react';

import { ProtoComponent, WithDescriptor } from '../../component';
import { ComponentPackage, createPackage } from '../../pkg';

/**
 * 绕过StyledComponents的动态创建检查.
 */
function cheatDynamicCreationCheck<T>(cb: () => T): T {
  const originalUseRef = React.useRef;
  try {
    React.useRef = (() => {
      console.error('invalid hook call');
    }) as any;
    return cb();
  } finally {
    React.useRef = originalUseRef;
  }
}

function loadModuleFromCode(self: PackagesRegistry, code: string) {
  // eslint-disable-next-line no-new-func
  return new Function('require', code).call(
    this,
    self.require.bind(globalPackagesRegistry)
  );
}

function loadCode(
  self: PackagesRegistry,
  serializedModule: any,
  defaultValue?: any
) {
  if (!serializedModule) return defaultValue;
  let module = cheatDynamicCreationCheck(() => {
    return loadModuleFromCode(self, serializedModule.compiledSrc);
  });
  if (!module) return defaultValue;
  if (module.default) {
    return module.default;
  } else {
    return values(module)[0];
  }
}

export function prcessComponentScripts(
  self: PackagesRegistry,
  component: ProtoComponent & WithDescriptor
) {
  const editorMeta = component.meta?.['_editor'];
  if (!editorMeta) return component;
  const ret = { ...component };
  if (editorMeta['warpper']) {
    ret.warpper = loadCode(self, editorMeta['warpper']);
  }
  if (editorMeta['useSetupStates']) {
    ret.useSetupStates = loadCode(self, editorMeta['useSetupStates']);
  }
  return ret;
}
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

  addComponent(component: ProtoComponent & WithDescriptor) {
    const comp = prcessComponentScripts(this, component);
    const { namespace, name } = comp.descriptor;
    let pkg = this.getPackage(namespace);
    if (!pkg) {
      pkg = createPackage(namespace);
      this.addPackage(pkg);
    }
    pkg.createComponent({
      ...comp,
      name,
    });
  }

  addComponents(components: Array<ProtoComponent & WithDescriptor>) {
    components.forEach(this.addComponent.bind(this));
  }

  getAllPackages() {
    return values(this.store);
  }

  require(pkgName: string) {
    let ret = this.dataMap[pkgName];
    if (ret) return ret;
    const umdName = this.umdMap[pkgName];
    if (umdName) ret = window[umdName];
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

/* eslint-disable no-restricted-globals */
if (typeof self === 'object')
  (self as any).globalPackagesRegistry = globalPackagesRegistry;
/* eslint-enable no-restricted-globals */
