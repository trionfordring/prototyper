import micromatch from 'micromatch';
import { RollupError, rollup } from 'rollup';

import { distPath, indexPath, srcPath } from './utils/cwd';
import { setBuildEnv } from './utils/env';
import { rollupPlugins } from './utils/rollupPlugins';
import { withTaskName } from './utils/withTaskName';

export const UMD_GLOBALS: Record<string, string> = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-is': 'ReactIs',
  '@prototyper/core': 'PrototyperCore',
  '@prototyper/editor': 'PrototyperEditor',
  lodash: '_',
  antd: 'antd',
  '@ant-design/icons': 'icons',
  'styled-components': 'styled',
  'monaco-editor/esm/vs/editor/editor.api': 'MonocoEditor',
  'react-dom/client': 'ReactDOM',
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
    const map: Record<string, boolean> = {};
    const promise = rollup({
      input: indexPath(),
      external: (id) => {
        if (id.startsWith('.') || id.startsWith(srcPath())) return false;
        const ans = micromatch.isMatch(id, external);
        if (ans) {
          const ex = map[id];
          if (!ex) {
            map[id] = true;
            console.log(`umd external: ${id} -> ${UMD_GLOBALS[id]}`);
          }
        }
        return ans;
      },
      plugins: rollupPlugins(),
      context: 'window',
      onwarn(warning) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        console.warn(`[${warning.code}]${warning.message}`);
      },
    });

    try {
      const res = await promise;
      await res.write({
        dir: distPath('umd'),
        format: 'umd',
        name,
        globals: UMD_GLOBALS,
      });
    } catch (e: any) {
      const err = e as RollupError;
      console.error(`umd编译失败:{
  id: '${err.id}',
  code: ${err.code},
  message: '${err.message}',
}`);
      throw e;
    }
  });
};
