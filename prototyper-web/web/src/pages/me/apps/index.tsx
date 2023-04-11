import { MyApplicationList } from '@/components/application/MyApplicationList';
import { useAuthChecker } from '@/hooks/useAuthChecker';
import { IndexLayout } from '@/layout/IndexLayout';
import { PageSecondary } from '@/layout/PageSecondary';

export default function Page() {
  useAuthChecker();
  return (
    <IndexLayout>
      <PageSecondary>
        <MyApplicationList />
      </PageSecondary>
    </IndexLayout>
  );
}
