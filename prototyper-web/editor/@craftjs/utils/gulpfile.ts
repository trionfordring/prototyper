import { parallel, series } from 'gulp';

import { clean } from '../../../build/clean';
import { dev } from '../../../build/dev';
import { buildDts } from '../../../build/dts';
import { buildLib } from '../../../build/lib';
import { withTaskName } from '../../../build/utils/withTaskName';

export const bundle = ['immer', 'nanoid', 'shallowequal', 'tiny-invariant'];
export default series(clean(), parallel(buildDts(), buildLib(bundle)));

export const devTask = withTaskName('dev', dev());
