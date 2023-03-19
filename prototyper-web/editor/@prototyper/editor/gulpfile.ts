import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildLib } from '../../../build/lib';
import { buildUmd } from '../../../build/umd';
import { setBuildEnv } from '../../../build/utils/env';
import { withTaskName } from '../../../build/utils/withTaskName';

setBuildEnv({
  styledComponent: true,
});
export default series(
  clean(),
  parallel(
    buildLib(),
    buildUmd('PrototyperEditor', [
      'react',
      'react-dom',
      'react-is',
      '@ant-design/icons',
      'styled-components',
      'lodash',
      '@prototyper/core',
      'styled-components',
      'monaco-editor',
      'monaco-editor/**',
    ])
  )
);

export const devTask = withTaskName(
  'dev',
  dev(['monaco-editor/esm/vs/language/typescript/ts.worker'])
);

export const lib = withTaskName('lib', buildLib());
