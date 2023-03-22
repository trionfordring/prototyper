import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import { PageHeader } from '@/layout/PageHeader';

export function ApplicationPageHeader() {
  const application = useApplicationInfo();
  return (
    <PageHeader
      title={`Prototyper - ${application.label || application.name}`}
      center={
        <div>
          统计信息 : 共计{application.mainPackage?.components?.length || 0}
          个组件，
          {application.mainPackage?.dependencies?.length || 0}个直接依赖。
        </div>
      }
      nav={[
        {
          href: {
            pathname: '/app/[id]',
            query: {
              id: application.id,
            },
          },
          label: '应用总览',
        },
        {
          href: {
            pathname: '/app/[id]/components',
            query: {
              id: application.id,
            },
          },
          label: '组件库',
        },
        {
          href: {
            pathname: '/app/[id]/dependencies',
            query: {
              id: application.id,
            },
          },
          label: '依赖库',
        },
        {
          href: {
            pathname: '/app/[id]/draggers',
            query: {
              id: application.id,
            },
          },
          label: '导出库',
        },
        {
          href: '/',
          label: '返回主页',
        },
      ]}
    />
  );
}
