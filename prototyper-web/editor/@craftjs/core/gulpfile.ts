import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildLib } from '../../../build/lib';
import { withTaskName } from '../../../build/utils/withTaskName';
import { bundle as utilsBundle } from '../utils/gulpfile';

export const bundle = [
  ...new Set(['debounce', 'tiny-invariant', '@craftjs/utils', ...utilsBundle]),
];

export default series(clean(), parallel(buildLib()));

export const devTask = withTaskName('dev', dev());
