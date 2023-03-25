import type { Category } from '@prototyper/core';
import { isEmpty, isNil } from 'lodash';
import { useState } from 'react';
import { EditableTabs } from '../gizmo/EditableTabs';
import { useCreateCategoryModal } from './CreateCategory';
import { Modal } from 'antd';
import { arrayMove } from '@dnd-kit/sortable';

export function compareCategory(a, b) {
  const o1 = isNil(a.order) ? 0 : a.order;
  const o2 = isNil(b.order) ? 0 : b.order;
  return o2 - o1;
}
function sortCatalogue(catalogue: Category[]): Category[] {
  catalogue.forEach((c) => {
    if (isNil(c.order)) c.order = 0;
    c.subcategories?.forEach((sc) => {
      if (isNil(sc.order)) sc.order = 0;
    });
    c.subcategories?.sort(compareCategory);
    c.subcategories?.forEach(
      (sc, idx) => (sc.order = c.subcategories.length - idx)
    );
  });
  catalogue.sort(compareCategory);
  catalogue?.forEach((c, idx) => (c.order = catalogue.length - idx));
  return catalogue;
}

export function EditCatalogue({
  initCatalogue = [],
}: {
  initCatalogue?: Category[];
}) {
  const [modal, contextHolder] = Modal.useModal();
  const [catalogue, setCatalogue] = useState(() =>
    sortCatalogue(initCatalogue)
  );
  const { modalNode, open } = useCreateCategoryModal(catalogue, (cate) => {
    setCatalogue((catalogue) => {
      const order = cate.order || 0;
      const toBeInsert = catalogue.findLastIndex(
        (c) => (c.order || 0) >= order
      );
      const newArr = Array.from(catalogue);
      newArr.splice(Math.max(toBeInsert, 0), 0, cate);
      return sortCatalogue(newArr);
    });
  });

  return (
    <>
      {contextHolder}
      {modalNode}
      <EditableTabs
        items={catalogue.map((category) => ({
          key: category.name,
          label: category.label || category.name,
          children: <div></div>,
        }))}
        onTabOrderChange={(from, to, dir) => {
          setCatalogue((catalogue) => {
            const fromIdx = catalogue.findIndex((c) => c.name === from);
            let toIdx;
            if (to) toIdx = catalogue.findIndex((c) => c.name === to);
            else if (dir === 'left') toIdx = 0;
            else {
              toIdx = isEmpty(catalogue) ? 0 : catalogue.length - 1;
            }
            const ans = arrayMove(catalogue, fromIdx, toIdx);
            ans.forEach((c, index) => (c.order = ans.length - index));
            return ans;
          });
        }}
        onEdit={(e, action) => {
          if (action === 'remove' && typeof e === 'string') {
            const idx = catalogue.findIndex((c) => c.name === e);
            if (idx < 0) return;
            const cate = catalogue[idx];
            modal.confirm({
              title: `确定要删除${cate.label || cate.name}吗?`,
              onOk() {
                setCatalogue((catalogue) => {
                  const newArr = Array.from(catalogue);
                  newArr.splice(idx, 1);
                  return newArr;
                });
              },
            });
          } else {
            open();
          }
        }}
      />
    </>
  );
}
