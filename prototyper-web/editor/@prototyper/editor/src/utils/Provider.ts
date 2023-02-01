export type Provider<T> = (() => T) | T;

export function consumeProvider<T>(provider: Provider<T>): T {
  if (typeof provider === 'function') return (provider as () => T)();
  return provider;
}
