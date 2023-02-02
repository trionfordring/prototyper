import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';
import { buildUmd } from '../../../build/umd';
import { run } from '../../../build/utils/process';
import { withTaskName } from '../../../build/utils/withTaskName';
import { bundle as craftBundle } from '../../@craftjs/core/gulpfile';

export default series(
  clean(),
  parallel(
    buildDts(),
    buildLib(['@craftjs/core', ...craftBundle]),
    buildUmd('PrototyperCore', ['react', 'react-dom', 'lodash'])
  )
);

export const devTask = withTaskName(
  'dev',
  parallel(dev(), () => run('pnpm run -F @craftjs/core dev'))
);
