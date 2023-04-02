import * as PrototyperCore from '@prototyper/core';
import { globalPackagesRegistry } from '@prototyper/core';
import * as PrototyperEditor from '@prototyper/editor';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactIs from 'react-is';
import * as StyledComponent from 'styled-components';
import * as _ from 'lodash';
import * as antd from 'antd';
import * as icons from '@ant-design/icons';

let embeddedPackagesInited = false;
const embeddedPackageArr: string[] = [];
export async function embeddedPackages() {
  if (!embeddedPackagesInited) await initEmbeddedPackages();
  return embeddedPackageArr;
}
function declear(pkgName: string, umdName: string, data: any) {
  globalPackagesRegistry.registerUmd(pkgName, umdName);
  if (typeof window !== 'object') throw new Error('找不到window对象，无法挂载');
  const root = window as any;
  root[umdName] = data;
}
function setEmbeddedPackage(pkgName: string, umdName: string, data: any) {
  declear(pkgName, umdName, data);
  embeddedPackageArr.push(pkgName);
}
async function initEmbeddedPackages() {
  setEmbeddedPackage('react', 'React', React);
  setEmbeddedPackage('react-is', 'ReactIs', ReactIs);
  setEmbeddedPackage('react-dom', 'ReactDOM', ReactDOM);
  setEmbeddedPackage('@prototyper/core', 'PrototyperCore', PrototyperCore);
  setEmbeddedPackage(
    '@prototyper/editor',
    'PrototyperEditor',
    PrototyperEditor
  );
  setEmbeddedPackage('styled-components', 'styled', {
    ...StyledComponent,
    ...StyledComponent.default,
  });
  setEmbeddedPackage('lodash', '_', _);
  setEmbeddedPackage('antd', 'antd', antd);
  setEmbeddedPackage('@ant-design/icons', 'icons', icons);

  console.log('声明内置lib', embeddedPackageArr);
  embeddedPackagesInited = true;
}
