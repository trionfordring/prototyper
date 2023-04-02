import { useEditor, useNode } from '@craftjs/core';
import { useMemo } from 'react';

import { PROTO_EXPR_ARGS } from '.';

import { DirectExpression, Expression, Tool } from '../utils';
import { ObjectWithExpression } from '../utils';

export const useNodeProps = () => {
  const { resolver } = useEditor((state) => ({
    resolver: state.options.resolver,
  }));
  const { props, mapperDeclear, isVirtual } = useNode((node) => {
    const isVirtual = resolver?.['ComponentRenderer'] === node.data.type;
    return {
      props: node.data.props,
      mapperDeclear: node.data.custom?.propsMapper,
      isVirtual,
    };
  });
  const [propsExpr, error] = useMemo(() => {
    if (!props) return [new DirectExpression({})];
    return Tool.try<[Expression<any> | null, Error | null]>(() => [
      new ObjectWithExpression(
        props,
        isVirtual ? { props: mapperDeclear } : mapperDeclear,
        PROTO_EXPR_ARGS
      ),
      null,
    ]).catch((e) => [null, e]);
  }, [props, isVirtual, mapperDeclear]);

  return { propsExpr, error };
};
