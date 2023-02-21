import { Plugin as RollupPlugin } from 'rollup';

export function transformLodash(): RollupPlugin {
  return {
    name: 'transformLodash',
    transform(code, id) {
      if (id.includes('lodash')) return null;
      return {
        code: code.replaceAll(
          /import ([a-zA-Z_]+) from .+lodash\/.+/g,
          'import { $1 } from "lodash";'
        ),
        map: null,
      };
    },
  };
}
