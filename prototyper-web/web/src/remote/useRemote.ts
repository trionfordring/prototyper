import { ClientError } from 'graphql-request';
import useSwr, { SWRConfiguration } from 'swr';

import { FetchKey, FetchVariables, fetcher } from './fetcher';

export function useRemote<R = {}, A extends FetchVariables = {}>(
  key?: FetchKey<R, A> | null | '',
  config?: SWRConfiguration
) {
  const swr = useSwr<R, ClientError>(key ? key : null, fetcher, config);
  return swr;
}
