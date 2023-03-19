import { Expression } from './Expression';
import { JSExpression } from './JSExpression';

type FmtCompiledTemplate = Array<string | JSExpression>;

function execComiledFmtStr(
  compiledFmtStr: FmtCompiledTemplate,
  context: object
): string {
  return String(
    compiledFmtStr
      .map((v) => {
        if (v instanceof JSExpression) return v.run(context);
        else return v;
      })
      .join('')
  );
}

const REG_FMT_VAR = /#\{([^#]+)\}/g;
function compileFmtStr(
  fmtStr: string,
  argNames: string[]
): FmtCompiledTemplate {
  const ans = [];
  const iter = fmtStr.matchAll(REG_FMT_VAR);
  let idx = 0;
  for (let it = iter.next(); !it.done; it = iter.next()) {
    const fmtVar = it.value;
    if (idx < fmtVar.index) ans.push(fmtStr.slice(idx, fmtVar.index));
    ans.push(new JSExpression(fmtVar[1], argNames));
    idx = fmtVar.index + fmtVar[0].length;
  }
  if (idx < fmtStr.length) ans.push(fmtStr.slice(idx));
  return ans;
}

export class FmtExpression implements Expression<string> {
  private readonly compiledFmt: FmtCompiledTemplate;
  constructor(fmtString: string, argNames: string[]) {
    this.compiledFmt = compileFmtStr(fmtString, argNames);
  }
  run(context: object) {
    return execComiledFmtStr(this.compiledFmt, context);
  }
}
