import { ProtoDragger, Category, Subcategories } from '@prototyper/core';
import { groupBy, isNil, map } from 'lodash';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { DraggerTabs } from './DraggerTabs';
import { DEFAULT_CATE, DraggersCatalogue } from './types';

const Pane = styled.section`
  width: 16.2rem;
  min-width: 200px;
  height: 100%;

  overflow-x: hide;
  overflow-y: auto;
`;

function processDefault(name: string) {
  if (name === DEFAULT_CATE) return '未命名分类';
  return name;
}
function getLabel(catalogue: Category[], cate: string, subcate?: string) {
  const c = catalogue.find((c) => c.name === cate);
  if (isNil(subcate)) return c?.label || processDefault(cate);
  return (
    c?.subcategories.find((s) => s.name === subcate)?.label ||
    processDefault(subcate)
  );
}
type WithOrder = {
  order?: number;
};
export function compareCategory(a: WithOrder, b: WithOrder) {
  const o1 = isNil(a.order) ? 0 : a.order;
  const o2 = isNil(b.order) ? 0 : b.order;
  return o2 - o1;
}
export function sortByCatalogue(
  catalogue: Category[],
  cates: DraggersCatalogue
) {
  cates.forEach((c) => {
    const record = catalogue.find((cata) => c.name === cata.name);
    c.order = record?.order;
    c.subcategories?.forEach((sub) => {
      const subRec = record?.subcategories.find(
        (subc) => subc.name === sub.name
      );
      sub.order = subRec?.order;
    });
  });
  cates.forEach((cate) => {
    cate.subcategories = cate.subcategories.sort(compareCategory);
  });
  return cates.sort(compareCategory);
}

function mergeSubCategories(subcategories?: Subcategories[]) {
  if (!subcategories) return [];
  return map(
    groupBy(subcategories, (s) => s.name),
    (v) =>
      v.reduce(
        (a, b) => ({
          name: a.name,
          label: b.label || a.label,
          order: Math.max(a.order || 0, b.order || 0),
        }),
        v[0]
      )
  );
}

function mergeCatalogue(catalogue?: Category[]): Category[] {
  if (!catalogue) return [];
  return map(
    groupBy(catalogue, (c) => c.name),
    (cs) =>
      cs.reduce((a, b) => {
        if (!a) return b;
        return {
          name: a.name,
          label: b.label || a.label,
          order: Math.max(a.order || 0, b.order || 0),
          subcategories: mergeSubCategories([
            ...a.subcategories,
            ...b.subcategories,
          ]),
        };
      }, cs[0])
  );
}

export function ComponentPane({
  draggers,
  catalogue = [],
}: {
  draggers: ProtoDragger[];
  catalogue?: Category[];
}) {
  const sortedDraggers = useMemo(() => {
    const mergedCatalogue = mergeCatalogue(catalogue);
    // 将所有draggers按照cate分类
    const groupbyCate = groupBy(
      draggers,
      (d) => d.draggerProps?.category || DEFAULT_CATE
    );
    const draggersCatalogue: DraggersCatalogue = map(
      groupbyCate,
      (draggersInCate, cate) => ({
        name: cate,
        label: getLabel(mergedCatalogue, cate),
        subcategories: map(
          // 将每个cate里的draggers按照subcate分类
          groupBy(
            draggersInCate,
            (d) => d.draggerProps?.subcategory || DEFAULT_CATE
          ),
          (draggersInSubcate, subcate) => ({
            name: subcate,
            label: getLabel(mergedCatalogue, cate, subcate),
            draggers: draggersInSubcate,
          })
        ),
      })
    );
    return sortByCatalogue(mergedCatalogue, draggersCatalogue);
  }, [catalogue, draggers]);
  return (
    <Pane>
      <DraggerTabs draggersCatalogue={sortedDraggers} />
    </Pane>
  );
}

export * from './types';
