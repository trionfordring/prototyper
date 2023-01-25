import { mapValues } from 'lodash';

import { Expression } from './Expression';
import { FmtExpression } from './FmtExpression';
import { JSExpression } from './JSExpression';

export const JS_EXPR: 'jsExpr' = 'jsExpr';
export const FMT_EXPR: 'fmtExpr' = 'fmtExpr';

export type SimplePropDeclear = typeof JS_EXPR | typeof FMT_EXPR;

export type PropDeclear = SimplePropDeclear | PropsMapDeclear;

export interface PropsMapDeclear {
  [k: string]: PropDeclear;
}

type Mapper = (context: object) => any;

function compilePropsMapper(
  props: object,
  declear?: PropDeclear,
  argNames?: string[]
): Mapper {
  const getDeclear = (k: string) => {
    const lk = k.toLowerCase();
    const ans: PropDeclear =
      declear[k] ||
      (lk.endsWith('expr')
        ? FMT_EXPR
        : lk.endsWith('val') || lk.startsWith('on')
        ? JS_EXPR
        : null);
    return ans;
  };
  const compiledObject = mapValues(props, (v, k) => {
    const dec = getDeclear(k);
    if (!dec) return v;
    const decType = typeof dec;
    if (decType === 'string') {
      switch (dec) {
        case JS_EXPR:
          return new JSExpression(v, argNames);
        case FMT_EXPR:
          return new FmtExpression(v, argNames);
      }
    } else if (decType === 'object') {
      return new ObjectWithExpression(v, dec, argNames);
    }
    return v;
  });

  return (context) => {
    return mapValues(compiledObject, (v, k) => {
      const dec = getDeclear(k);
      if (!dec) return v;
      if (typeof (v as any)?.run === 'function') {
        return (v as Expression<any>).run(context);
      }
      return v;
    });
  };
}

export class ObjectWithExpression implements Expression<unknown> {
  private readonly mapper: Mapper;
  constructor(
    props: object,
    declear: PropDeclear = {},
    argNames: string[] = []
  ) {
    this.mapper = compilePropsMapper(props, declear, argNames);
  }
  run(context: object) {
    return this.mapper(context);
  }
}
