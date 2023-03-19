import path from 'path';

import micromatch from 'micromatch';
import { ExternalOption } from 'rollup';

import { getHash } from '../plugins/utils/getHash';

export const rollupExternal =
  (bundle: string[]): ExternalOption =>
  (id: string) => {
    return (
      !id.startsWith('.') &&
      !id.startsWith('src') &&
      !getHash(id).includes('blob') &&
      !path.isAbsolute(id) &&
      !micromatch.isMatch(id, bundle)
    );
  };
