import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';
import { buildUmd } from '../../../build/umd';
import { setBuildEnv } from '../../../build/utils/env';

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
