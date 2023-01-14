import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';

export const bundle = ['immer', 'nanoid', 'shallowequal', 'tiny-invariant'];
export default series(clean(), parallel(buildDts(), buildLib(bundle)));
