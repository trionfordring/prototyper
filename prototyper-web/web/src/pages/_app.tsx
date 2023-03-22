import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const Layout = useLayout();
  if (Layout)
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  return <Component {...pageProps} />;
}

const ApplicationLayout = dynamic(
  async () => (await import('@/layout/ApplicationLayout')).ApplicationLayout
);
function useLayout() {
  const router = useRouter();
  if (router.pathname.startsWith('/app')) return ApplicationLayout;
  return null;
}
