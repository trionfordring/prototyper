import {
  DeleteOutlined,
  EditOutlined,
  MenuOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Category, Subcategories } from '@prototyper/core';
import { Table, RowProps, Button, Space, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { noop } from 'lodash';
import React from 'react';
import { useCreateSubcategoryModal } from './CreateSubcategory';
import { CateLike, useEditCategoryModal } from './EditCategory';

interface DataType {
  name: string;
  label: string;
  order?: number;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && { ...transform, scaleY: 1 }
    )?.replace(/translate3d\(([^,]+),/, 'translate3d(0,'),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

export function EditSubcategory({
  category,
  onMove = noop,
  onDelete = noop,
  onSet = noop,
  onCategoryMetaChange = noop,
}: {
  category: Category;
  onMove?: (
    from: UniqueIdentifier,
    to: UniqueIdentifier | undefined,
    dir: 'up' | 'down'
  ) => void;
  onDelete?: (name: string) => void;
  onSet?: (name: string, data: Subcategories) => void;
  onCategoryMetaChange?: (category: CateLike) => void;
}) {
  const [modalApi, modalContext] = Modal.useModal();
  const subcategories = category?.subcategories || [];
  const { modalNode, open: openCreateSubcategoryModal } =
    useCreateSubcategoryModal(subcategories, (subcate) => {
      onSet(subcate.name, subcate);
    });
  const { modalNode: editSubModalNode, open: openSubEditModal } =
    useEditCategoryModal((cate) => onSet(cate.name, cate));
  const { modalNode: editModalNode, open: openEditModal } =
    useEditCategoryModal((cate) => onCategoryMetaChange(cate));
  const onDragEnd = ({ active, over, delta }: DragEndEvent) => {
    if (active.id !== over?.id) {
      onMove(active.id, over?.id, delta.y > 0 ? 'down' : 'up');
    }
  };
  const columns: ColumnsType<DataType> = [
    {
      key: 'sort',
      width: 60,
      align: 'center',
    },
    {
      title: '唯一名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '显示名称',
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openSubEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              modalApi.confirm({
                onOk() {
                  onDelete(record.name);
                },
                title: `确定要删除子类目[${record.label || record.name}]吗?`,
              });
            }}
          >
            移除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {modalContext}
      {editSubModalNode}
      {editModalNode}
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={subcategories.map((i) => i.name)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            size="middle"
            pagination={false}
            components={{
              body: {
                row: Row,
              },
            }}
            rowKey="name"
            columns={columns}
            dataSource={subcategories}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align="right">
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(category)}
                    >
                      修改当前类目
                    </Button>
                    {modalNode}
                    <Button
                      icon={<PlusCircleOutlined />}
                      type="primary"
                      onClick={openCreateSubcategoryModal}
                    >
                      创建子类目
                    </Button>
                  </Space>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </SortableContext>
      </DndContext>
    </>
  );
}
