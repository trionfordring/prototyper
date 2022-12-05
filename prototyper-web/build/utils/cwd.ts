import path from 'path';

import { buildOptions, setBuildEnv } from './env';
import { PROJ_ROOT } from './paths';

export function setDist(path: string) {
  setBuildEnv({
    distDir: path,
  });
}

export function setCwd(path: string) {
  setBuildEnv({
    workDir: path,
  });
}

export function resolve(...paths: string[]) {
  return path.resolve(buildOptions.workDir, ...paths);
}

export function distPath(...paths: string[]) {
  return path.resolve(buildOptions.distDir, 'dist', ...paths);
}

export function indexPath() {
  return path.resolve(buildOptions.workDir, 'src', 'index.ts');
}

export function srcPath() {
  return path.resolve(buildOptions.workDir, 'src');
}

export function tsGlobForDir(dir: string) {
  return `${dir}/**/*{.d.ts,.ts,.tsx,js,jsx}`;
}

export function srcTsGlob() {
  return tsGlobForDir(srcPath());
}

export function projRoot(...paths: string[]) {
  return path.resolve(PROJ_ROOT, ...paths);
}
