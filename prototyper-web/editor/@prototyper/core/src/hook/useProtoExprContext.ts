import {
  LoopContextType,
  useApplicationContext,
  useComponentContext,
  useLoopContext,
} from '../context';

export interface ProtoExprContext {
  props: any;
  meta: any;
  state: any;
  appStates: any;
  loop?: LoopContextType;
}

export const PROTO_EXPR_ARGS = ['props', 'meta', 'state', 'appStates', 'loop'];

export function useProtoExprContext() {
  const { props, meta, state } = useComponentContext();
  const { appStates } = useApplicationContext();
  const loop = useLoopContext();
  const exprContext: ProtoExprContext = {
    props,
    meta,
    state,
    appStates,
    loop,
  };
  return exprContext;
}
