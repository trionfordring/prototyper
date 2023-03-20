const SCRIPT_MARK_KEY = 'prototyper-script';

const cacheTable: Record<string, Promise<void>> = {};

export function loadScript(src: string) {
  if (cacheTable[src]) return cacheTable[src];
  const encodeSrc = encodeURI(src);
  const task = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.setAttribute(SCRIPT_MARK_KEY, encodeSrc);
    el.onload = () => resolve();
    el.onerror = (_, _1, _2, _3, error) => reject(error);
    document.head.appendChild(el);
  });
  cacheTable[src] = task;
  return task;
}
