import { parallel, series } from 'gulp';

import { run } from './build/utils/process';
import { withTaskName } from './build/utils/withTaskName';

export const core = () => run('pnpm run -F @prototyper/core build');

export const editor = () => run('pnpm run -F @prototyper/editor build');

export const materials = parallel(
  () => run('pnpm run -F @prototyper/std-materials build'),
  () => run('pnpm run -F @prototyper/router-materials build')
);
export const materialsDev = parallel(
  () => run('pnpm run -F @prototyper/std-materials dev'),
  () => run('pnpm run -F @prototyper/router-materials dev')
);

export const previewer = () => run('pnpm run -F @prototyper/previewer build');

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

export const testCore = withTaskName('test:core', () =>
  run('jest editor/@prototyper/core')
);

export default parallel(core, editor, previewer);

export const devTask = withTaskName(
  'dev',
  parallel(
    () => run('pnpm run -F @craftjs/core dev'),
    () => run('pnpm run -F @craftjs/utils dev'),
    () => run('pnpm run -F @craftjs/layers dev'),

    () => run('pnpm run -F @prototyper/core dev'),
    () => run('pnpm run -F @prototyper/editor dev'),

    materialsDev
  )
);
