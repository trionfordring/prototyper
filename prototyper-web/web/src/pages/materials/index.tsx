import { DependenciesMarket } from '@/components/application/dependency/DependenciesMarket';
import { IndexLayout } from '@/layout/IndexLayout';
import { PageSecondary } from '@/layout/PageSecondary';
import Head from 'next/head';

export default function Page() {
  return (
    <IndexLayout>
      <Head>
        <title>Prototyper - 物料市场</title>
      </Head>
      <PageSecondary>
        <DependenciesMarket />
      </PageSecondary>
    </IndexLayout>
  );
}
