import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';
import { buildUmd } from '../../../build/umd';
import { withTaskName } from '../../../build/utils/withTaskName';

export default series(
  clean(),
  parallel(
    buildDts(),
    buildLib(),
    buildUmd('PrototyperStdMaterials', ['react', 'react-dom', 'lodash'])
  )
);

export const devTask = withTaskName('dev', dev());
