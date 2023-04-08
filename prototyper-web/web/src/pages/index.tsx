import Head from 'next/head';
import { IndexLayout } from '@/layout/IndexLayout';
import { PageMain } from '@/layout/PageMain';
import { HomeTitle } from '@/components/home/HomeTitle';

export default function Home() {
  return (
    <IndexLayout>
      <Head>
        <title>Prototyper</title>
      </Head>
      <PageMain>
        <HomeTitle />
      </PageMain>
    </IndexLayout>
  );
}
