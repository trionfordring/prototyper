import { Expression } from './Expression';

const EXPORT_REG = /@export\((.+)\)/i;
function matchExport(expression: string): string | undefined {
  const matched = EXPORT_REG.exec(expression);
  if (!matched || matched.length < 2) return undefined;
  return matched[1];
}

function compile(expression: string, argNames: string[]): Function {
  const exportKey = matchExport(expression);
  if (exportKey) expression = `${expression};return ${exportKey};`;
  else expression = `return ${expression}`;
  // eslint-disable-next-line no-new-func
  const func = new Function(...argNames, expression);
  return func;
}

export class JSExpression implements Expression<unknown> {
  private readonly func: Function;
  private readonly argNames: string[];
  constructor(expression: string, argNames: string[]) {
    this.argNames = argNames;
    this.func = compile(expression, this.argNames);
  }

  run(context: object) {
    return this.func.apply(
      context,
      this.argNames.map((key) => context[key])
    );
  }
}
