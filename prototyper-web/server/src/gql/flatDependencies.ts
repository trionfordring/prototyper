import { Strapi } from '@strapi/strapi';
import { filter, identity, noop, throttle } from 'lodash';

const DEP_KEY = 'dependencies';
const DEVDEP_KEY = 'devDependencies';
const POPULATE = [DEP_KEY];
const POPULATE_WITHDEV = [DEP_KEY, DEVDEP_KEY];

/**
 * 在指定dep上下文下检索repo的相关依赖
 */
function findDepsFn(
  repo: ReturnType<typeof strapi.db.query>,
  withDev: boolean = false,
  depMap: Record<string, string> = {},
  excludeMap: Record<string, boolean> = {},
  onDepPush: (id: string) => void = noop
) {
  // 记录递归的深度
  let deepth = 0;
  async function loadById(id: string) {
    if (deepth > 50) {
      console.error('依赖检索深度过深，已放弃');
      return;
    }
    const populate = withDev ? POPULATE_WITHDEV : POPULATE;
    const current: {
      id: string;
      name: string;
      excludeDependencies?: string[];
      [k: string]: any;
    } = await repo.findOne({
      select: ['id', 'name', 'excludeDependencies'],
      where: {
        id,
      },
      populate,
    });
    if (depMap[current.name] || excludeMap[current.name]) return;
    deepth++;
    depMap[current.name] = current.id;
    current.excludeDependencies?.forEach((ex) => (excludeMap[ex] = true));
    for (let i = 0; i < populate.length; i++) {
      const key = populate[i];
      for (let j = 0; j < current?.[key]?.length; j++) {
        const d = current?.[key][j];
        await loadById(d.id);
      }
    }
    deepth--;
    onDepPush(current.id);
  }
  return loadById;
}

export function flatPackages(strapi: Strapi, withDev: boolean = false) {
  const commonDependenciesTask = throttle(
    () => commonDependencies(strapi, withDev),
    60 * 1000
  );
  return async function (ids: Iterable<string>): Promise<string[]> {
    const idList = [...ids];
    const packageRepo = await strapi.db.query('api::package.package');
    // 在递归中，所有同名依赖只会被访问一次
    const { newContext } = await commonDependenciesTask();
    const { include, exclude, pushStack } = newContext();
    const res = pushStack;
    const loadById = findDepsFn(packageRepo, withDev, include, exclude, (i) =>
      res.push(i)
    );
    // 递归查找依赖
    await Promise.all(idList.map(loadById));
    const flatedDepIds = filter(include, (i, name) => !exclude[name]);
    return res.filter((i) => flatedDepIds.includes(i));
  };
}

export function flatDependencies(strapi: Strapi, withDev: boolean = false) {
  const flatHandler = flatPackages(strapi, withDev);
  return async function (self: { id: string }) {
    if (!self || !self.id)
      throw new Error(`id不能为空:${JSON.stringify(self)}`);
    const packageRepo = await strapi.db.query('api::package.package');
    const flatedDepIds = await flatHandler([self.id]);
    const data = await packageRepo.findMany({
      where: {
        id: {
          $in: flatedDepIds,
        },
      },
    });
    const deps = flatedDepIds.map((i) => data.find((d) => d.id === i));
    return deps;
  };
}

export async function commonDependencies(
  strapi: Strapi,
  withDev: boolean = false
) {
  const tasks = [];
  async function workBy(repo: ReturnType<typeof strapi.db.query>) {
    const deps = await repo.findOne({
      populate: ['packages'],
    });
    return deps?.packages?.map((d) => d.id);
  }
  const depRepo = await strapi.db.query(
    'api::common-dependency.common-dependency'
  );
  tasks.push(workBy(depRepo));
  if (withDev) {
    const devDepRepo = await strapi.db.query(
      'api::common-dev-dependency.common-dev-dependency'
    );
    tasks.push(workBy(devDepRepo));
  }
  // 获取到所有的直接相关依赖
  const idArr = (await Promise.all(tasks)).flatMap(identity);
  const depMap: Record<string, string> = {};
  const excludeMap: Record<string, boolean> = {};
  const packageRepo = strapi.db.query('api::package.package');
  const res = [];
  const findDeps = findDepsFn(packageRepo, withDev, depMap, excludeMap, (i) =>
    res.push(i)
  );
  // 递归查找相关依赖
  for (let i = 0; i < idArr.length; i++) {
    // 此处必须顺序执行
    await findDeps(idArr[i]);
  }
  return {
    newContext: () => ({
      include: { ...depMap },
      exclude: { ...excludeMap },
      pushStack: [...res],
    }),
  };
}
