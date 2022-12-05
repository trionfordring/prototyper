import { run } from './utils/process';
import { withTaskName } from './utils/withTaskName';

export const clean = () => {
  return withTaskName('clean', () => run('rimraf dist'));
};
