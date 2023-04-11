import { CreateApplicationForm } from '@/components/application/settings/CreateApplication';
import { IndexLayout } from '@/layout/IndexLayout';
import { PageSecondary } from '@/layout/PageSecondary';

export default function Page() {
  return (
    <IndexLayout>
      <PageSecondary>
        <CreateApplicationForm />
      </PageSecondary>
    </IndexLayout>
  );
}
