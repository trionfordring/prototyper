import { useApplicationContext, useComponentContext } from '../context';

export interface ProtoExprContext {
  props: any;
  meta: any;
  state: any;
  appStates: any;
  rootProps: any;
}

export function useProtoExprContext() {
  const { props, meta, state } = useComponentContext();
  const { appStates, rootProps } = useApplicationContext();
  const exprContext = {
    props,
    meta,
    state,
    appStates,
    rootProps,
  };
  return exprContext;
}
