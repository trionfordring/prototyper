import { parallel, series } from 'gulp';

import { run } from './build/utils/process';
import { withTaskName } from './build/utils/withTaskName';

export const core = () => run('pnpm run -F @prototyper/core build');

export const changelog = () => run('changeset add');

export const release = () => run('changeset version');

export const publishCore = withTaskName(
  'publish:core',
  series(
    () => run('pnpm login --registry https://registry.npmjs.org'),
    () => run('pnpm run build:prod core'),
    () =>
      run(
        'pnpm publish -F core --registry https://registry.npmjs.org --access=public'
      )
  )
);

export default parallel(core);
