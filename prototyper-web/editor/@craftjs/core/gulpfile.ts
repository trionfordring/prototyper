import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';
import { bundle as utilsBundle } from '../utils/gulpfile';

export const bundle = [
  ...new Set(['debounce', 'tiny-invariant', '@craftjs/utils', ...utilsBundle]),
];

export default series(clean(), parallel(buildDts(), buildLib()));
