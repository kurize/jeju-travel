'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TimelineItemRecord } from '@/lib/types';

interface SortableTimelineProps {
  items: TimelineItemRecord[];
  onReorder: (newItems: TimelineItemRecord[]) => void;
  renderItem: (item: TimelineItemRecord, index: number, dragHandleProps: DragHandleProps | null) => React.ReactNode;
  renderOverlay?: (item: TimelineItemRecord) => React.ReactNode;
}

export interface DragHandleProps {
  ref: (node: HTMLElement | null) => void;
  listeners: Record<string, Function> | undefined;
  attributes: React.HTMLAttributes<HTMLElement>;
}

function SortableItem({
  item,
  index,
  renderItem,
}: {
  item: TimelineItemRecord;
  index: number;
  renderItem: SortableTimelineProps['renderItem'];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative' as const,
  };

  const dragHandleProps: DragHandleProps = {
    ref: setActivatorNodeRef,
    listeners,
    attributes,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, index, dragHandleProps)}
    </div>
  );
}

export default function SortableTimeline({
  items,
  onReorder,
  renderItem,
  renderOverlay,
}: SortableTimelineProps) {
  const [activeItem, setActiveItem] = useState<TimelineItemRecord | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const item = items.find((i) => i.id === event.active.id);
    if (item) setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      sort_order: idx,
    }));
    onReorder(newItems);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <SortableItem
            key={item.id}
            item={item}
            index={index}
            renderItem={renderItem}
          />
        ))}
      </SortableContext>

      <DragOverlay>
        {activeItem && renderOverlay ? renderOverlay(activeItem) : null}
      </DragOverlay>
    </DndContext>
  );
}
