import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildLib } from '../../../build/lib';
import { buildUmd } from '../../../build/umd';
import { withTaskName } from '../../../build/utils/withTaskName';

export default series(
  clean(),
  parallel(
    buildLib(),
    buildUmd('PrototyperStdMaterials', [
      'react',
      'react-dom',
      'react-is',
      'lodash',
      'antd',
      '@prototyper/editor',
      '@prototyper/core',
      'styled-components',
    ])
  )
);

export const devTask = withTaskName('dev', dev());
