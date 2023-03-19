import dynamic from 'next/dynamic';

export const ComponentEditor = dynamic(
  async () => {
    const Module = await import('./ComponentEditor1');
    return Module.ComponentEditor1;
  },
  {
    ssr: false,
  }
);
