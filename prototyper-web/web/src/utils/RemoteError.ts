import { ClientError } from 'graphql-request';
import { GraphQLError } from 'graphql-request/dist/types';

export function remoteError(e?: ClientError) {
  const errors: GraphQLError[] = e
    ? e.response.errors || [e.response.error]
    : [];

  function someKey(key: string, value: any) {
    return () =>
      errors.some(
        (err: any) => (err[key] || err.extensions?.error?.[key]) === value
      );
  }

  const ret = {
    errors,
    hasUnauthorized: someKey('name', 'UnauthorizedError'),
    hasForbidden: someKey('code', 'FORBIDDEN'),
  };

  return ret;
}
