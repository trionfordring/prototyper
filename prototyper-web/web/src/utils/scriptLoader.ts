export async function loadScript(src: string) {
  const exist = Array.from(document.head.querySelectorAll('script')).some(
    (e) => e.src === src
  );
  if (exist) return;
  return new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve();
    el.onerror = (_, _1, _2, _3, error) => reject(error);
    document.head.appendChild(el);
  });
}
