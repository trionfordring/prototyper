const SCRIPT_MARK_KEY = 'prototyper-script';

export async function loadScript(src: string) {
  const encodeSrc = encodeURI(src);
  const exist = Array.from(
    document.head.querySelectorAll(`script[${SCRIPT_MARK_KEY}="${encodeSrc}"]`)
  );
  if (exist.length > 0) return;
  return new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.setAttribute(SCRIPT_MARK_KEY, encodeSrc);
    el.onload = () => resolve();
    el.onerror = (_, _1, _2, _3, error) => reject(error);
    document.head.appendChild(el);
  });
}
