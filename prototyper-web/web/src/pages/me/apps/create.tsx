import { CreateApplicationForm } from '@/components/application/settings/CreateApplication';
import { IndexLayout } from '@/layout/IndexLayout';
import { PageSecondary } from '@/layout/PageSecondary';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  return (
    <IndexLayout>
      <PageSecondary>
        <CreateApplicationForm
          onCreateSuccess={(id) =>
            router.replace({
              pathname: '/app/[id]',
              query: {
                id,
              },
            })
          }
        />
      </PageSecondary>
    </IndexLayout>
  );
}
