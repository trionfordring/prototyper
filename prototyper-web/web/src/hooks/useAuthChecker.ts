import { useMe } from '@/remote';
import { remoteError } from '@/utils/RemoteError';
import { merge } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AuthCheckerOptions {
  login: boolean;
}

const DEFAULT_OPTIONS: AuthCheckerOptions = {
  login: true,
};

export type AuthCheckerOptionsType = Partial<AuthCheckerOptions>;

function log(...args: any[]) {
  console.log('[AuthChecker]', ...args);
}

export function useAuthChecker(optionsProp?: AuthCheckerOptionsType) {
  const { error } = useMe();
  const router = useRouter();
  useEffect(() => {
    const options: AuthCheckerOptions = merge({}, DEFAULT_OPTIONS, optionsProp);
    if (options.login) {
      const hasLogin = !error && !remoteError(error).hasForbidden();
      if (!hasLogin) {
        log('检查到用户未登录');
        router.replace({
          pathname: '/login',
          query: {
            source: router.pathname,
          },
        });
      }
    }
  }, [error, optionsProp, router]);
}
