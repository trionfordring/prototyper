import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS, Transform } from '@dnd-kit/utilities';
import { Tabs, TabsProps } from 'antd';
import { noop } from 'lodash';
import React from 'react';

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-node-key': string;
  onActiveBarTransform: (
    enabled: boolean,
    transform?: Transform,
    transition?: string
  ) => void;
}

const DraggableTabNode = ({
  className,
  onActiveBarTransform,
  ...props
}: DraggableTabPaneProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props['data-node-key'],
    });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition: transition || 'none',
    cursor: 'move',
  };

  return React.cloneElement(props.children as React.ReactElement, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};

export function EditableTabs({
  onTabOrderChange = noop,
  ...props
}: Omit<TabsProps, 'type' | 'renderTabBar'> & {
  onTabOrderChange?: (
    from: UniqueIdentifier,
    to: UniqueIdentifier | undefined,
    direction: 'left' | 'right'
  ) => void;
}) {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const onDragEnd = ({ active, over, delta }: DragEndEvent) => {
    if (active.id !== over?.id) {
      onTabOrderChange(active.id, over?.id, delta.x > 0 ? 'right' : 'left');
    }
  };
  const items = props.items || [];
  return (
    <Tabs
      {...props}
      type="editable-card"
      items={items}
      renderTabBar={(tabBarProps, DefaultTabBar) => (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext
            items={items.map((i) => i.key)}
            strategy={horizontalListSortingStrategy}
          >
            <DefaultTabBar {...tabBarProps}>
              {(node) => (
                <DraggableTabNode {...node.props} key={node.key}>
                  {node}
                </DraggableTabNode>
              )}
            </DefaultTabBar>
          </SortableContext>
        </DndContext>
      )}
    />
  );
}
