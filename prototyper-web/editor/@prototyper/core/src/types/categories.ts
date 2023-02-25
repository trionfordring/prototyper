export interface Category {
  name: string;
  label: string;
  order?: number;
  subcategories: Subcategories[];
}

export interface Subcategories {
  name: string;
  label: string;
  order?: number;
}
