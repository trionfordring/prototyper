import path from 'path';

import { ExternalOption } from 'rollup';

import { getHash } from '../plugins/utils/getHash';

export const rollupExternal =
  (bundle: string[]): ExternalOption =>
  (id: string) => {
    return (
      !id.startsWith('.') &&
      !getHash(id).includes('blob') &&
      !path.isAbsolute(id) &&
      !bundle.includes(id)
    );
  };
