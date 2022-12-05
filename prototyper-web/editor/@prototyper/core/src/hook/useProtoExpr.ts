import { useProtoExprContext } from './useProtoExprContext';

import { buildExpr } from '../utils/expr';

export function useProtoExpr(exprString: string): any {
  const context = useProtoExprContext();
  return buildExpr(exprString, context)();
}
