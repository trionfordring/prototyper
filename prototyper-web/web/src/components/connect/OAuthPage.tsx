import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { oauthLogin } from '@/remote';
import { Alert, AlertProps, Typography } from 'antd';
import { memoize } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentType, useEffect, useState } from 'react';
import { UrlObject } from 'url';

const login = memoize(
  oauthLogin,
  ({ provider, accessToken }) => `${provider}[${accessToken}]`
);

type PageState = 'wait' | 'loading' | 'error' | 'success';

const tipMap: Record<
  PageState,
  {
    alertType: AlertProps['type'];
    message: string;
    description: ComponentType<{
      error?: string;
      successUrl: UrlObject | string;
    }>;
  }
> = {
  wait: {
    alertType: 'info',
    message: '请稍候...',
    description: () => <>正在准备认证工作。</>,
  },
  loading: {
    alertType: 'warning',
    message: '请稍候...',
    description: () => (
      <>我们正在进行第三方认证，稍等一下马上就会跳转到其他页面。</>
    ),
  },
  error: {
    alertType: 'error',
    message: '认证失败',
    description: ({ error }) => <>{error}</>,
  },
  success: {
    alertType: 'success',
    message: '认证成功',
    description: ({ successUrl }) => (
      <>
        认证已经完成，即将跳转。你也可以
        <Link legacyBehavior passHref replace href={successUrl}>
          <Typography.Link>点此手动跳转</Typography.Link>
        </Link>
        。
      </>
    ),
  },
};

export function OAuthPage({
  error: errProp,
  accessToken,
  provider,
  successUrl = '/',
}: {
  error?: string;
  accessToken?: string;
  provider: string;
  successUrl?: UrlObject | string;
}) {
  const [state, setState] = useState<PageState>('wait');
  const [error, setError] = useState<string | undefined>(errProp);
  const router = useRouter();
  useEffect(() => {
    if (state !== 'wait') return;
    if (error) {
      setState('error');
    } else if (provider && accessToken) {
      setState('loading');
      login({
        provider,
        accessToken,
      })
        .then(() => {
          setState('success');
          router.replace(successUrl);
        })
        .catch((error) => {
          setState('error');
          setError(error.message);
        });
    } else {
      let reason = '';
      if (!provider) reason += '找不到认证服务提供者。';
      if (!accessToken) reason += '找不到认证令牌。';
      setState('error');
      setError(`认证发生异常:${reason}`);
    }
  }, [accessToken, error, provider, router, state, successUrl]);
  const tipInfo = tipMap[state];
  const Description = tipInfo.description;
  return (
    <FullPageCenter background="light-grey">
      <Alert
        className="shadow-box"
        type={tipInfo.alertType}
        showIcon
        message={tipInfo.message}
        description={
          <Description error={error} successUrl={successUrl}></Description>
        }
      />
    </FullPageCenter>
  );
}
