import path from 'path';

import { parallel, series } from 'gulp';
import { rollup, RollupBuild } from 'rollup';

import { distPath, indexPath } from './utils/cwd';
import { rollupPlugins } from './utils/rollupPlugins';
import { withTaskName } from './utils/withTaskName';

export const buildLib = (bundle = ['tslib']) => {
  let res: RollupBuild;
  async function compile() {
    res = await rollup({
      input: indexPath(),
      external: (id) => {
        return (
          !id.startsWith('.') && !path.isAbsolute(id) && !bundle.includes(id)
        );
      },
      plugins: rollupPlugins(),
    });
  }
  function write(type: 'cjs' | 'esm') {
    return async () =>
      await res.write({
        dir: distPath(type),
        format: type,
      });
  }
  return series(
    withTaskName('compile lib', compile),
    parallel(
      withTaskName('generate cjs', write('cjs')),
      withTaskName('generate esm', write('esm'))
    )
  );
};
