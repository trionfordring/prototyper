import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildDts } from '../../../build/dts';
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
    buildDts(),
    buildLib(),
    buildUmd('PrototyperEditor', [
      'react',
      'react-dom',
      'react-is',
      'antd',
      'styled-components',
      'lodash',
      '@prototyper/core',
    ])
  )
);

export const devTask = withTaskName(
  'dev',
  dev(['monaco-editor/esm/vs/language/typescript/ts.worker'])
);

export const lib = withTaskName('lib', buildLib());
