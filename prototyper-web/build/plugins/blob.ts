import { readFileSync } from 'fs';

import resolve from '@rollup/plugin-node-resolve';
import { Plugin as RollupPlugin } from 'rollup';

import { getHash } from './utils/getHash';

function plainString(str: string) {
  return str
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
    .replaceAll('\r', '\\r')
    .replaceAll('\t', '\\t');
}

export function blob(): RollupPlugin {
  const resolver = resolve();
  const resolveModule =
    typeof resolver.resolveId === 'function'
      ? resolver.resolveId
      : resolver.resolveId.handler;
  return {
    name: 'blobLoader',
    async resolveId(source, importer, options) {
      const { custom = {} } = options;
      const {
        blobLoader = {
          resolved: false,
        },
      } = custom;
      if (blobLoader.resolved) return null;
      const hash = getHash(source);
      if (!hash.includes('blob')) return null;

      const resolved = await resolveModule.call(
        {
          resolve: () => null,
        },
        source,
        importer,
        {
          ...options,
          custom: {
            ...options.custom,
            blobLoader: {
              resolved: true,
            },
          },
        }
      );
      return {
        ...resolved,
        moduleSideEffects: false,
        meta: {
          blobLoader: {
            resolved: true,
          },
          ...resolved.meta,
        },
      };
    },
    async load(id) {
      const hash = getHash(id);
      if (!hash.includes('blob')) return null;
      const rawCode = readFileSync(
        id.substring(0, id.lastIndexOf('?')),
        'utf8'
      );
      const code = `const blob = new Blob(['${plainString(rawCode)}'], {
  type: 'text/javascript',
});
export default blob;`;
      return code;
    },
  };
}
