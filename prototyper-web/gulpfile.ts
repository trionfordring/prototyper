import { parallel } from 'gulp';

import { run } from './build/utils/process';

export const core = () => run('pnpm run -F @prototyper/core build');

export const changelog = () => run('changeset add');

export const release = () => run('changeset version');

export default parallel(core);
