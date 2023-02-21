export function getHash(id: string): string[] {
  const splitByHash = id.split('?');
  if (splitByHash.length <= 1) return [];
  const hashWithAnchor = splitByHash[splitByHash.length - 1];
  const hash = hashWithAnchor.split('#')[0];
  return hash.split('&');
}
