import { Typography } from 'antd';
import { PropsWithChildren } from 'react';
import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import { HOST } from '@/env';

export function ApplicationPlayLink({
  children,
  appName,
  showHref = false,
}: PropsWithChildren<{ appName?: string; showHref?: boolean }>) {
  const applicationInfo = useApplicationInfo();
  const href = `${HOST}/api/preview/${encodeURIComponent(
    appName || applicationInfo.name
  )}`;
  return (
    <Typography.Link href={href} target="_blank">
      {children}
      {showHref ? href : null}
    </Typography.Link>
  );
}
