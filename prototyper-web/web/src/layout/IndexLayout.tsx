import { PropsWithChildren } from 'react';
import { PageHeader } from './PageHeader';

export function IndexLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader
        nav={[
          {
            href: '/',
            label: '总览',
          },
          {
            href: '/applications',
            label: '应用广场',
          },
          {
            href: '/materials',
            label: '物料市场',
          },
          {
            href: '/me/apps',
            label: '我的应用',
            isActived(pathname) {
              return pathname.startsWith('/me/apps');
            },
          },
          {
            href: '/me',
            label: '用户信息',
          },
        ]}
      />
      {children}
    </>
  );
}
