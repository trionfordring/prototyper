import '@/styles/globals.css';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import zhCN from 'antd/lib/locale/zh_CN';

export default function App({ Component, pageProps }: AppProps) {
  const Layout = useLayout();
  let component = <Component {...pageProps} />;
  if (Layout) component = <Layout>{component}</Layout>;
  component = <ConfigProvider locale={zhCN}>{component}</ConfigProvider>;
  return component;
}

const ApplicationLayout = dynamic(
  async () => (await import('@/layout/ApplicationLayout')).ApplicationLayout
);
function useLayout() {
  const router = useRouter();
  if (router.pathname.startsWith('/app/')) return ApplicationLayout;
  return null;
}
