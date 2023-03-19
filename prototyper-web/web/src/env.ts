export const dev = process.env.NODE_ENV === 'development';
export const HOST = dev
  ? '//localhost:1337'
  : process.env.HOST || '//localhost:1337';
export const GRAPHQL_URL = `${HOST}/graphql`;
