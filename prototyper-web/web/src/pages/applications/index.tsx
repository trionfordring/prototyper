import { UserApplicationList } from '@/components/application/UserApplicationList';
import { IndexLayout } from '@/layout/IndexLayout';
import { PageSecondary } from '@/layout/PageSecondary';

export default function Page() {
  return (
    <IndexLayout>
      <PageSecondary>
        <UserApplicationList />
      </PageSecondary>
    </IndexLayout>
  );
}
