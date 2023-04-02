const SCRIPT_MARK_KEY = 'prototyper-script';

const cacheTable: Record<string, Promise<void>> = {};

declare global {
  interface Window {
    define?: Function;
  }
}

export function loadScript(src: string) {
  if (cacheTable[src]) return cacheTable[src];
  const encodeSrc = encodeURI(src);
  const task = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.setAttribute(SCRIPT_MARK_KEY, encodeSrc);
    if (typeof window.define === 'function') {
      const oldDefine = window.define;
      window.define = undefined;
      el.onload = () => {
        resolve();
        window.define = oldDefine;
      };
    } else {
      el.onload = () => resolve();
    }
    el.onerror = (_, _1, _2, _3, error) => reject(error);
    document.head.appendChild(el);
  });
  cacheTable[src] = task;
  return task;
}
