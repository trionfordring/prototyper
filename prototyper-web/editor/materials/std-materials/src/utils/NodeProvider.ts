import { ReactNode } from 'react';

export type NodeProvider = (() => ReactNode) | ReactNode;

export function getReactNode(provider?: NodeProvider): ReactNode {
  if (typeof provider === 'function') return provider();
  return provider;
}
