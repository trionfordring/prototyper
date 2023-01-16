import {
  LoopContextType,
  useApplicationContext,
  useComponentContext,
} from '../context';

export interface ProtoExprContext {
  props: any;
  meta: any;
  state: any;
  appStates: any;
  loop?: LoopContextType;
}

export function useProtoExprContext() {
  const { props, meta, state } = useComponentContext();
  const { appStates } = useApplicationContext();
  const exprContext: ProtoExprContext = {
    props,
    meta,
    state,
    appStates,
  };
  return exprContext;
}
