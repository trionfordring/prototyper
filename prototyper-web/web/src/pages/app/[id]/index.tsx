import { ApplicationHomeHeader } from '@/components/application/ApplicationHomeHeader';
import { ApplicationReadme } from '@/components/application/ApplicationReadme';
import { ApplicationLayout } from '@/layout/ApplicationLayout';
import { PageMain } from '@/layout/PageMain';

export default function Page() {
  return (
    <ApplicationLayout>
      <ApplicationHomeHeader />
      <PageMain>
        <ApplicationReadme />
      </PageMain>
    </ApplicationLayout>
  );
}
