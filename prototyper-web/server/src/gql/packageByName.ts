import { Strapi } from '@strapi/strapi';
export function packageByName(strapi: Strapi) {
  return function (self: undefined, { name }: { name: string }) {
    const store = strapi.db.query('api::package.package');
    return store.findOne({
      where: {
        name,
      },
    });
  };
}
