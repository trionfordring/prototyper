import { Strapi } from '@strapi/strapi';
import { isNil, merge } from 'lodash';

function urljoin(...paths: string[]) {
  return paths.reduce((base, path) => {
    if (!base) return path;
    if (path.startsWith('/') && base.endsWith('/'))
      return base + path.substring(1);
    if (!path.startsWith('/') && !base.endsWith('/')) return base + '/' + path;
    return base + path;
  }, '');
}

export async function setupProvider(strapi: Strapi) {
  const apiPrefix = strapi.config.get('api.rest.prefix');
  const baseURL = urljoin(strapi.config.server.url, apiPrefix, 'auth');
  const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const prevGrantConfig = (await store.get({ key: 'grant' })) || {};
  if (isNil(prevGrantConfig.qq)) {
    const newConfig = merge(
      {
        qq: {
          enabled: false,
          icon: 'qq',
          key: '',
          secret: '',
          callback: `${baseURL}/qq/callback`,
          scope: ['user', 'user:email'],
        },
      },
      prevGrantConfig
    );
    console.log('更新GrantConfig:', newConfig);
    await store.set({ key: 'grant', value: newConfig });
  }
  const oauth = strapi
    .plugin('users-permissions')
    .service('providers-registry');
  oauth.register('qq', () => {
    console.log('qq load');
    return (...args) => {
      console.log('qq', ...args);
      throw new Error('qq');
    };
  });
}
