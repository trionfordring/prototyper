import { keysIn } from 'lodash';

export function buildExpr(expr: string, context: any): Function {
  const keys = keysIn(context);
  // eslint-disable-next-line no-new-func
  const func = new Function(...keys, `return ${expr}`);
  return func.bind(context, ...keys.map((k) => context[k]));
}
