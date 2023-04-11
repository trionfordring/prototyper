export function getQueryString(query?: string | string[]): string | undefined {
  if (Array.isArray(query)) return query[0];
  return query;
}
