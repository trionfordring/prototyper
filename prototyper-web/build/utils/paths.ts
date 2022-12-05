import { resolve } from 'path';

export const PROJ_ROOT = resolve(__dirname, '..', '..');
export const TSCONFIG_PATH = resolve(PROJ_ROOT, 'tsconfig.json');

export const EDITOR_PACKAGES_PATH = resolve(PROJ_ROOT, 'editor', 'packages');
