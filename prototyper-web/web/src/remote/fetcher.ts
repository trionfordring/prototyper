import { RequestExtendedOptions, Variables, request } from 'graphql-request';

import { GRAPHQL_URL } from '@/env';
import { GraphQLDocument } from '@/utils/graphql';
import { LocalStorageTools } from '@/utils/LocalStorageTools';
import { deepMapValues } from '@/utils/deepMap';

export type FetchVariables = Variables;
export type FetchDocument<T = {}, A = {}> = GraphQLDocument<T, A>;
export type FetchTupleKey<T = {}, A extends FetchVariables = {}> = [
  FetchDocument<T, A>,
  A
];
export type FetchKey<T = {}, A extends FetchVariables = {}> =
  | FetchDocument<T, A>
  | FetchTupleKey<T, A>;

const NULL_KEY_ERR = new Error('无法查询空key');
const NULL_DOCUMENT_ERR = new Error('无法查询空的document');

let authorization: string | null =
  typeof localStorage === 'object'
    ? LocalStorageTools.getItem('authorization')
    : null;
if (authorization) console.log('已恢复会话');

export async function fetcher<T = any, A extends FetchVariables = {}>(
  key: FetchKey<T, A>
): Promise<T> {
  if (!key) throw NULL_KEY_ERR;
  const withVars = Array.isArray(key);
  const variables = withVars ? key[1] : undefined;
  let document = withVars ? key[0] : key;
  if (!document) throw NULL_DOCUMENT_ERR;
  const headers: HeadersInit = {};
  if (authorization) headers['Authorization'] = authorization;
  const requestOptions: RequestExtendedOptions = {
    url: GRAPHQL_URL,
    document: document.stringify(),
    variables,
    requestHeaders: headers,
  };
  const response = await request(requestOptions);

  return deepMapValues(response, (v, k) =>
    typeof v === 'string' && typeof k === 'string' && k.endsWith('At')
      ? new Date(v)
      : v
  );
}

export function setAuthorization(token?: string) {
  authorization = token ? `Bearer ${token}` : null;
  if (!authorization) {
    LocalStorageTools.removeItem('authorization');
    console.log('会话已结束');
  } else {
    LocalStorageTools.setItem(
      'authorization',
      authorization,
      1000 * 60 * 60 * 24 * 30
    );
    console.log('会话开始');
  }
}
