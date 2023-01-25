import { useNode } from '@craftjs/core';
import { useMemo } from 'react';

import { PROTO_EXPR_ARGS } from './useProtoExprContext';

import { DirectExpression, Expression, Tool } from '../utils';
import { FmtExpression } from '../utils';
import { JSExpression } from '../utils';

export const useNodeCustom = () => {
  const { custom } = useNode((state) => ({ custom: state.data.custom }));
  const [forValExpr, forValExprError] = useMemo(() => {
    if (!custom.forVal) return [new DirectExpression()];
    return Tool.try<[Expression<any>, Error]>(() => [
      new JSExpression(custom.forVal, PROTO_EXPR_ARGS),
      null,
    ]).catch((e) => [null, e]);
  }, [custom.forVal]);
  const [forKeyExpr, forKeyExprError] = useMemo(() => {
    if (!custom.forKey) return [new DirectExpression()];
    return Tool.try<[Expression<any>, Error]>(() => [
      new FmtExpression(custom.forKey, PROTO_EXPR_ARGS),
      null,
    ]).catch((e) => [null, e]);
  }, [custom.forKey]);
  const [hiddenExpr, hiddenExprError] = useMemo(() => {
    if (!custom.hiddenVal) return [new DirectExpression(false)];
    return Tool.try<[Expression<any>, Error]>(() => [
      new JSExpression(custom.hiddenVal, PROTO_EXPR_ARGS),
      null,
    ]).catch((e) => [null, e]);
  }, [custom.hiddenVal]);

  return {
    forKeyExpr,
    forKeyExprError,
    forValExpr,
    forValExprError,
    hiddenExpr,
    hiddenExprError,
  };
};
