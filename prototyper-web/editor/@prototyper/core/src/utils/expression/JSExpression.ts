import { Expression } from './Expression';

function compile(expression: string, argNames: string[]): Function {
  // eslint-disable-next-line no-new-func
  const func = new Function(...argNames, `return ${expression}`);
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
