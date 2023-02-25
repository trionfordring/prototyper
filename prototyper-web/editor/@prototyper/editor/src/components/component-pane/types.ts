import { ProtoDragger } from '@prototyper/core';

export interface DraggersCategory {
  name: string;
  label: string;
  order?: number;
  subcategories: DraggersSubcategory[];
}

export interface DraggersSubcategory {
  name: string;
  label: string;
  order?: number;
  draggers: ProtoDragger[];
}

export type DraggersCatalogue = DraggersCategory[];

export const DEFAULT_CATE = 'default';
