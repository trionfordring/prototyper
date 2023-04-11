import { factories } from '@strapi/strapi';
import createError from 'http-errors';
import { Context } from 'koa';
import { identity } from 'lodash';

import { flatPackages } from '../../../gql/flatDependencies';

export default factories.createCoreController(
  'api::application.application',
  ({ strapi }) => {
    const previewDepSearcher = flatPackages(strapi, false);
    return {
      async preview(ctx: Context) {
        ctx.type = 'html';
        const params = ctx.params;
        if (!params.name) {
          throw createError(404, '请指定目标程序名称.');
        }
        const appRepo = strapi.db.query('api::application.application');
        const pkgRepo = strapi.db.query('api::package.package');
        const app = await appRepo.findOne({
          where: {
            name: params.name,
          },
          populate: {
            index: {},
            mainPackage: {
              select: [],
              populate: {
                dependencies: {
                  selet: ['id'],
                },
              },
            },
          } as any,
        });
        if (!app) {
          throw createError(404, `找不到名称为[${params.name}]的程序.`);
        }
        const index = app.index;
        const depIds = app?.mainPackage.dependencies?.map((d) => d.id) || [];
        if (app?.mainPackage) depIds.push(app.mainPackage.id);
        const flatIds = (await previewDepSearcher(depIds)) || [];
        const depsUnsorted = await pkgRepo.findMany({
          where: {
            id: {
              $in: flatIds,
            },
          },
          populate: ['umds', 'components'],
        });
        const deps = flatIds.map((i) => depsUnsorted.find((d) => d.id === i));

        const requireMaps = JSON.stringify(
          deps.flatMap((d) => d.globalSymbols || [])
        );

        const extComponents = JSON.stringify(
          deps.flatMap((dep) =>
            (dep.components || [])
              .map((comp) => {
                if (!comp || !comp.data) return null;
                return {
                  ...comp.data,
                  descriptor: {
                    namespace: dep.name,
                    name: comp.name,
                  },
                };
              })
              .filter(identity)
          )
        );
        const scripts = deps
          .flatMap((dep) => dep.umds?.map((file) => file.url) || [])
          .map((url) => `<script type="text/javascript" src="${url}"></script>`)
          .join('\n');
        const template = `<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${app.name}</title>
    ${scripts}
  </head>
  <body>
    <div id="root"></div>
    <script>
      const requireMaps = ${requireMaps};
      requireMaps.forEach(({symbol,name})=>globalPackagesRegistry.registerUmd(symbol,name));
      const components = ${extComponents};
      globalPackagesRegistry.addComponents(components);
      ${
        index && index.name && index.namespace
          ? `PrototyperPreviewer.render(document.getElementById('root'), { namespace: '${index.namespace}', name: '${index.name}'});`
          : ''
      }
    </script>
  </body>
</html>`;
        ctx.body = template;
      },
    };
  }
);
