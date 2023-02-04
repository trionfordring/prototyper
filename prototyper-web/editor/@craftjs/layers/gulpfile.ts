import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';
import { setBuildEnv } from '../../../build/utils/env';
import { bundle as coreBundle } from '../core/gulpfile';

setBuildEnv({
  svg: true,
  styledComponent: true,
});

export const bundle = [
  ...new Set(['react-contenteditable', '@craftjs/core', ...coreBundle]),
];

export default series(clean(), parallel(buildDts(), buildLib()));

export const devTask = dev();
