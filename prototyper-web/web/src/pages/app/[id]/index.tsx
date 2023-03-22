import { ApplicationHomeHeader } from '@/components/application/ApplicationHomeHeader';
import { ApplicationReadme } from '@/components/application/ApplicationReadme';
import { PageMain } from '@/layout/PageMain';

export default function Page() {
  return (
    <>
      <ApplicationHomeHeader />
      <PageMain>
        <ApplicationReadme />
      </PageMain>
    </>
  );
}
