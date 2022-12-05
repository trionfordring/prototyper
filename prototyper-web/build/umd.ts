import { rollup } from 'rollup';

import { distPath, indexPath } from './utils/cwd';
import { setBuildEnv } from './utils/env';
import { rollupPlugins } from './utils/rollupPlugins';
import { withTaskName } from './utils/withTaskName';

export const UMD_GLOBALS: Record<string, string> = {
  react: 'React',
  'react-dom': 'ReactDom',
  '@prototyper/core': 'ProrotyperCore',
  '@prototyper/editor': 'ProrotyperEditor',
  lodash: 'lodash',
};

export const buildUmd = (
  name: string,
  external: string[] = ['react', 'react-dom']
) => {
  if (external.includes('lodash')) {
    setBuildEnv({
      transformLodash: true,
    });
  }
  return withTaskName('generate umd', async () => {
    const res = await rollup({
      input: indexPath(),
      external,
      plugins: rollupPlugins(),
    });

    await res.write({
      dir: distPath('umd'),
      format: 'umd',
      name,
      globals: UMD_GLOBALS,
    });
  });
};
