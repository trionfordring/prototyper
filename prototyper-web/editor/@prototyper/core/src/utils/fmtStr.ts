import { buildExpr } from './expr';

function execComiledFmtStr(compiledFmtStr: Array<string | Function>): string {
  return String(
    compiledFmtStr
      .map((v) => {
        if (typeof v === 'function') return v();
        else return v;
      })
      .join('')
  );
}

const REG_FMT_VAR = /#\{([^#]+)\}/g;
function compileFmtStr(fmtStr: string, context: any): Array<string | Function> {
  const ans = [];
  const iter = fmtStr.matchAll(REG_FMT_VAR);
  let idx = 0;
  for (let fmtVar of iter) {
    if (idx < fmtVar.index) ans.push(fmtStr.slice(idx, fmtVar.index));
    ans.push(buildExpr(fmtVar[1], context));
    idx = fmtVar.index + fmtVar[0].length;
  }
  if (idx < fmtStr.length) ans.push(fmtStr.slice(idx));
  return ans;
}

export function buildFmtStr(fmtStr: string, context: any): Function {
  const compiledFmtStr = compileFmtStr(fmtStr, context);
  return execComiledFmtStr.bind(this, compiledFmtStr);
}
