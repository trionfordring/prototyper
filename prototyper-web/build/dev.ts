import path from 'path';

import { watch } from 'rollup';

import { distPath, indexPath, packagePath } from './utils/cwd';
import { rollupPlugins } from './utils/rollupPlugins';
import { withTaskName } from './utils/withTaskName';

export const dev = (bundle = ['tslib']) => {
  return withTaskName('dev', () => {
    const watcher = watch({
      input: indexPath(),
      external: (id) => {
        return (
          !id.startsWith('.') && !path.isAbsolute(id) && !bundle.includes(id)
        );
      },
      plugins: rollupPlugins(),
      output: [
        {
          dir: distPath('esm'),
          format: 'esm',
        },
      ],
    });
    watcher.on('event', (event) => {
      switch (event.code) {
        case 'START':
          import(packagePath()).then((json) => {
            console.log(`[${json.name}] Dev服务已启动.`);
          });
          break;
      }
    });
  });
};
