import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';
import { buildUmd } from '../../../build/umd';

export default series(
  clean(),
  parallel(
    buildDts(),
    buildLib(),
    buildUmd('PrototyperStdMaterials', ['react', 'react-dom', 'lodash'])
  )
);
