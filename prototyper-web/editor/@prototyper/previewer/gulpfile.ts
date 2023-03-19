import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildUmd } from '../../../build/umd';
import { withTaskName } from '../../../build/utils/withTaskName';

export default series(
  clean(),
  parallel(buildUmd('PrototyperPreviewer', ['**/*']))
);

export const devTask = withTaskName('dev', dev());
