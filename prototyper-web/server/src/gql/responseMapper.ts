import { Entity, Response, WithId } from './types';

export function toEntity<T extends WithId>(data: T): Entity<T> {
  return {
    id: data.id,
    attributes: data,
  };
}

export function toEntityList<T extends WithId>(data?: T[]): Entity<T>[] {
  return data?.map(toEntity) || [];
}

export function toResponse<T extends WithId | WithId[]>(data: T): Response<T> {
  if (Array.isArray(data)) {
    return {
      data: data.map(toEntity),
      meta: {
        pagination: {
          page: 1,
          pageSize: data.length,
          total: data.length,
          pageCount: 1,
        },
      },
    } as Response<T>;
  }
  return {
    data: toEntity(data),
  } as Response<T>;
}
