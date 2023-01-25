import { useNode } from '@craftjs/core';
import { useMemo } from 'react';

import { PROTO_EXPR_ARGS } from '.';

import { DirectExpression, Expression, Tool } from '../utils';
import { ObjectWithExpression } from '../utils';

export const useNodeProps = () => {
  const { props, mapperDeclear } = useNode((node) => ({
    props: node.data.props,
    mapperDeclear: node.data.custom?.propsMapper,
  }));
  const [propsExpr, error] = useMemo(() => {
    if (!props) return [new DirectExpression({})];
    return Tool.try<[Expression<any>, Error]>(() => [
      new ObjectWithExpression(props, mapperDeclear, PROTO_EXPR_ARGS),
      null,
    ]).catch((e) => [null, e]);
  }, [props, mapperDeclear]);

  return { propsExpr, error };
};
