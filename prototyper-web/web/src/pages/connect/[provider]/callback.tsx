import { OAuthPage } from '@/components/connect/OAuthPage';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { GetStaticPaths, GetStaticProps } from 'next/types';

export default function Page({ provider }: { provider: string }) {
  const router = useRouter();
  const accessToken = router.query['access_token'] as string;
  const error = router.query['error'] as string;
  return (
    <>
      <Head>
        <title>{`正在认证${provider} - Prototyper`}</title>
      </Head>
      <OAuthPage provider={provider} accessToken={accessToken} error={error} />
    </>
  );
}
export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      provider: context.params?.provider,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const providers = ['github', 'qq'];
  return {
    paths: providers.map((provider) => ({
      params: {
        provider,
      },
    })),
    fallback: true,
  };
};
