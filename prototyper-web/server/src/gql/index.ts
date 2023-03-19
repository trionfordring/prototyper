import { Strapi } from '@strapi/strapi';

import { flatDependencies } from './flatDependencies';
import { packageByName } from './packageByName';
import { GraphQLExt } from './types';

const extGql = `extend type Package {
  # 平铺列出计算后的依赖(包括了递归依赖,并去除了exclude指定的依赖)
  flatDependencies: [PackageEntity!]!
  flatDevDependencies: [PackageEntity!]!
}
extend type Query {
  packageByName(name: String): PackageEntity
}
`;

export function setupGql(strapi: Strapi) {
  const extensionService = strapi.plugin('graphql').service('extension');
  const ext: GraphQLExt = {
    typeDefs: extGql,
    resolvers: {
      Package: {
        flatDependencies: flatDependencies(strapi),
        flatDevDependencies: flatDependencies(strapi, true),
      },
      Query: {
        packageByName: packageByName(strapi),
      },
    },
    resolversConfig: {
      'Package.flatDependencies': {
        auth: {
          scope: ['api::package.package.find'],
        },
      },
      'Package.flatDevDependencies': {
        auth: {
          scope: ['api::package.package.find'],
        },
      },
      'Query.packageByName': {
        auth: {
          scope: ['api::package.package.find'],
        },
      },
    },
  };
  extensionService.use(ext);
}
