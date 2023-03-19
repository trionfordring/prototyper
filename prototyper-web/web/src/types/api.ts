export interface WithCreatedAndUpdatedAt {
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

export interface PageMeta {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export type ID = string;

export interface WithId {
  id: ID;
}

export type JSONType = any;

export type Nil = null | undefined;

export type Merge<A, B> = Omit<A, keyof B> & B;
