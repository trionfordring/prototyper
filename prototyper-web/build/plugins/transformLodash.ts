import { Plugin as RollupPlugin } from 'rollup';

export function transformLodash(): RollupPlugin {
  return {
    name: 'transformLodash',
    transform(code, id) {
      if (id.includes('lodash')) return code;
      return code.replaceAll(
        /import ([a-zA-Z_]+) from .+lodash\/.+/g,
        'import { $1 } from "lodash";'
      );
    },
  };
}
