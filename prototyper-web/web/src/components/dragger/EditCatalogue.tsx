import type { Category } from '@prototyper/core';
import { isEmpty, isNil, noop } from 'lodash';
import { useEffect, useState } from 'react';
import { EditableTabs } from '../gizmo/EditableTabs';
import { useCreateCategoryModal } from './CreateCategory';
import { Button, Modal, message } from 'antd';
import { arrayMove } from '@dnd-kit/sortable';
import { EditSubcategory } from './EditSubcategory';
import { useUncontrolledState } from '@/hooks/useUncontrolledState';
import { SaveOutlined } from '@ant-design/icons';

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
  value,
  onChange = noop,
  onSave = noop,
  initialValue = [],
}: {
  value?: Category[];
  initialValue?: Category[];
  onChange?: (v: Category[]) => void;
  onSave?: (v: Category[]) => void | Promise<void>;
}) {
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageNode] = message.useMessage();
  const [isSaving, setIsSaving] = useState(false);
  const [catalogue, setCatalogue] = useUncontrolledState(
    value,
    onChange,
    initialValue
  );
  useEffect(() => {
    if (Array.isArray(value)) {
      onChange(sortCatalogue(value));
    }
  }, [onChange, value]);
  const { modalNode, open } = useCreateCategoryModal(catalogue, (cate) => {
    setCatalogue((catalogue) => {
      const order = cate.order || 0;
      const toBeInsert = (catalogue as any).findLastIndex(
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
      {messageNode}
      <EditableTabs
        tabBarExtraContent={
          <Button
            icon={<SaveOutlined />}
            onClick={async () => {
              setIsSaving(true);
              try {
                await onSave(catalogue);
              } catch (e: any) {
                messageApi.error('保存失败');
              } finally {
                setIsSaving(false);
              }
            }}
            loading={isSaving}
          >
            保存目录
          </Button>
        }
        items={catalogue.map((category) => ({
          key: category.name,
          label: category.label || category.name,
          children: (
            <EditSubcategory
              category={category}
              onSet={(name, subcate) => {
                setCatalogue((catalogue) => {
                  const cateIdx = catalogue.findIndex(
                    (c) => c.name === category.name
                  );
                  if (cateIdx < 0) return catalogue;
                  const cate = catalogue[cateIdx];
                  const subcates = cate.subcategories || [];
                  const toBeSetIdx = subcates.findIndex((c) => c.name === name);
                  if (toBeSetIdx < 0) {
                    subcates.push(subcate);
                  } else {
                    subcates[toBeSetIdx] = subcate;
                  }
                  catalogue[cateIdx].subcategories = [...subcates];
                  return [...catalogue];
                });
              }}
              onDelete={(name) => {
                setCatalogue((catalogue) => {
                  const cateIdx = catalogue.findIndex(
                    (c) => c.name === category.name
                  );
                  if (cateIdx < 0) return catalogue;
                  const cate = catalogue[cateIdx];
                  const subcate = cate.subcategories || [];
                  const toBeDeleteIdx = subcate.findIndex(
                    (c) => c.name === name
                  );
                  if (toBeDeleteIdx < 0) return catalogue;
                  subcate.splice(toBeDeleteIdx, 1);
                  catalogue[cateIdx].subcategories = [...subcate];
                  console.log(`移除子类目: ${cate.name}-${name}`, catalogue);
                  return [...catalogue];
                });
              }}
              onMove={(from, to, dir) => {
                setCatalogue((catalogue) => {
                  const cateIndex = catalogue.findIndex(
                    (c) => c.name === category.name
                  );
                  if (cateIndex < 0) return catalogue;
                  const cate = catalogue[cateIndex];
                  const subcate = cate.subcategories || [];
                  const fromIdx = subcate.findIndex((c) => c.name === from);
                  let toIdx;
                  if (to) toIdx = subcate.findIndex((c) => c.name === to);
                  else if (dir === 'up') toIdx = 0;
                  else {
                    toIdx = isEmpty(subcate) ? 0 : subcate.length - 1;
                  }
                  const newSubcate = arrayMove(subcate, fromIdx, toIdx);
                  newSubcate.forEach(
                    (c, index) => (c.order = newSubcate.length - index)
                  );
                  cate.subcategories = newSubcate;
                  catalogue[cateIndex] = cate;
                  return [...catalogue];
                });
              }}
              onCategoryMetaChange={(cateLike) => {
                setCatalogue((catalogue) => {
                  const cateIndex = catalogue.findIndex(
                    (c) => c.name === category.name
                  );
                  if (cateIndex < 0) return catalogue;
                  const cate = catalogue[cateIndex];
                  catalogue[cateIndex] = {
                    ...cate,
                    ...cateLike,
                  };
                  return [...catalogue];
                });
              }}
            />
          ),
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
