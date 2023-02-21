import { watch } from 'rollup';

import { distPath, indexPath, packagePath } from './utils/cwd';
import { rollupExternal } from './utils/rollupExternal';
import { rollupPlugins } from './utils/rollupPlugins';
import { withTaskName } from './utils/withTaskName';

export const dev = (bundle = ['tslib']) => {
  return withTaskName('dev', async () => {
    const watcher = watch({
      input: indexPath(),
      external: rollupExternal(bundle),
      plugins: rollupPlugins(),
      output: [
        {
          dir: distPath('esm'),
          format: 'esm',
          sourcemap: 'inline',
        },
      ],
    });
    return new Promise<void>((resolve, reject) => {
      watcher.on('event', (event) => {
        switch (event.code) {
          case 'START':
            import(packagePath()).then((json) => {
              console.log(`[${json.name}] Dev服务已启动.`);
            });
            break;
          case 'ERROR':
            reject(event.error);
            break;
          case 'END':
            resolve();
            break;
        }
      });
    });
  });
};
