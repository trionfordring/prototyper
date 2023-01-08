import { useApplicationContext, useComponentContext } from '../context';

export interface ProtoExprContext {
  props: any;
  meta: any;
  state: any;
  appStates: any;
}

export function useProtoExprContext() {
  const { props, meta, state } = useComponentContext();
  const { appStates } = useApplicationContext();
  const exprContext = {
    props,
    meta,
    state,
    appStates,
  };
  return exprContext;
}
