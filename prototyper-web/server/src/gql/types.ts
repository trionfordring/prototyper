import { Policy } from '@strapi/strapi/lib/core/registries/policies';

export interface ResolversConfig {
  auth?:
    | boolean
    | {
        scope: string[];
      };
  policies?: Policy[];
}

export interface GraphQLExt {
  typeDefs?: string;
  resolvers?: any;
  resolversConfig?: Record<string, ResolversConfig>;
}

export interface WithId {
  id: string;
}

export interface WithName {
  name: string;
}

export interface Entity<T = any> {
  id: string;
  attributes?: Omit<T, 'id'>;
}

export interface EntityResponse<T = any> {
  data: Entity<T>;
}

export interface EntityResponseCollection<T = any> {
  data: Entity<T>[];
  meta: ResponseCollectionMeta;
}

export interface ResponseCollectionMeta {
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export type Response<T = any> = T extends Array<infer V>
  ? EntityResponseCollection<V>
  : EntityResponse<T>;
