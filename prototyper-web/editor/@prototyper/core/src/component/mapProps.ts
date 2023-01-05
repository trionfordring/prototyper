import { mapValues } from 'lodash';

import { buildExpr } from '../utils/expr';
import { buildFmtStr } from '../utils/fmtStr';

function doMap(props: Object, context: any) {
  return mapValues(props, (v, k) => {
    if (typeof k !== 'string' || typeof v !== 'string') {
      return v;
    }
    if (k.startsWith('on') || k.endsWith('val') || k.endsWith('Val')) {
      return buildExpr(v, context)();
    } else if (k.endsWith('Expr') || k.endsWith('expr')) {
      return buildFmtStr(v, context)();
    }
    return v;
  });
}

export function defaultMapProps(props: Object, context: any) {
  const ans = doMap(props, context);
  // 如果存在{ props: {xxx} }的结构，会自动继续解析子props
  if (ans['props']) {
    ans['props'] = doMap(ans['props'], context);
  }

  return ans;
}
