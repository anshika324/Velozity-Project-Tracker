import { useState, useRef, useCallback } from 'react';
import type { Task, Status, CollabUser } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { useStore } from '../../store';
import { useTouchDrag } from '../../hooks/useTouchDrag';

const COLUMNS: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

interface Props {
  filteredTasks: Task[];
  collabUsers: CollabUser[];
}

export function KanbanBoard({ filteredTasks, collabUsers }: Props) {
  const moveTask = useStore((s) => s.moveTask);

  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);
  const [snapBackId,     setSnapBackId]     = useState<string | null>(null);

  const originalStatusRef = useRef<Status | null>(null);
  const droppedRef        = useRef(false);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    const ghost = document.createElement('div');
    ghost.style.cssText = 'position:fixed;top:-9999px;width:1px;height:1px;';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
    const task = filteredTasks.find((t) => t.id === taskId);
    if (task) originalStatusRef.current = task.status;
    droppedRef.current = false;
    setSnapBackId(null);
    setDraggingTaskId(taskId);
  }, [filteredTasks]);

  const handleDragEnd = useCallback((_e: React.DragEvent) => {
    if (!droppedRef.current && draggingTaskId) {
      setSnapBackId(draggingTaskId);
      setTimeout(() => setSnapBackId(null), 350);
    }
    setDraggingTaskId(null);
    setDragOverColumn(null);
    originalStatusRef.current = null;
  }, [draggingTaskId]);

  const handleDragOver = useCallback((e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => setDragOverColumn(null), []);

  const handleDrop = useCallback((e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) { moveTask(taskId, status); droppedRef.current = true; }
    setDraggingTaskId(null);
    setDragOverColumn(null);
  }, [moveTask]);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchDrag(
    (taskId) => {
      const task = filteredTasks.find((t) => t.id === taskId);
      if (task) originalStatusRef.current = task.status;
      droppedRef.current = false;
      setDraggingTaskId(taskId);
    },
    () => { setDraggingTaskId(null); setDragOverColumn(null); },
    (taskId, status) => { moveTask(taskId, status); droppedRef.current = true; },
  );

  return (
    <div className="flex gap-4 h-full p-4 overflow-x-auto">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={filteredTasks.filter((t) => t.status === status)}
          collabUsers={collabUsers}
          draggingTaskId={draggingTaskId}
          snapBackId={snapBackId}
          dragOverColumn={dragOverColumn}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      ))}
    </div>
  );
}