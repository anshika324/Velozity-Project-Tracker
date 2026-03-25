import { useEffect, useRef } from 'react';
import type { Task, CollabUser, Status } from '../../types';
import { PriorityBadge } from '../shared/PriorityBadge';
import { Avatar } from '../shared/Avatar';
import { DueDateLabel } from '../shared/DueDateLabel';
import { getInitials } from '../../utils/date';

interface Props {
  task: Task;
  collabUsers: CollabUser[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onTouchStart: (e: TouchEvent, taskId: string, status: Status) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  isDragging: boolean;
}

export function KanbanCard({
  task, collabUsers,
  onDragStart, onDragEnd,
  onTouchStart, onTouchMove, onTouchEnd,
  isDragging,
}: Props) {
  const viewers = collabUsers.filter((u) => u.currentTaskId === task.id);
  const ref = useRef<HTMLDivElement>(null);

  // Wire touch events imperatively so we can pass { passive: false }
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ts = (e: TouchEvent) => onTouchStart(e, task.id, task.status);
    const tm = (e: TouchEvent) => onTouchMove(e);
    const te = (e: TouchEvent) => onTouchEnd(e);
    el.addEventListener('touchstart', ts, { passive: false });
    el.addEventListener('touchmove',  tm, { passive: false });
    el.addEventListener('touchend',   te, { passive: false });
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove',  tm);
      el.removeEventListener('touchend',   te);
    };
  }, [task.id, task.status, onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <div
      ref={ref}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      data-task-id={task.id}
      className={`bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing select-none transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/20 ${
        isDragging ? 'opacity-40 ring-2 ring-indigo-500' : ''
      }`}
    >
      {viewers.length > 0 && (
        <div className="flex -space-x-1 mb-2">
          {viewers.slice(0, 3).map((u) => (
            <div
              key={u.id}
              title={`${u.name} is viewing`}
              className="avatar-enter w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center text-[8px] font-bold text-white"
              style={{ background: u.color }}
            >
              {getInitials(u.name)}
            </div>
          ))}
          {viewers.length > 3 && (
            <div className="w-5 h-5 rounded-full border border-slate-900 bg-slate-600 flex items-center justify-center text-[8px] text-slate-300">
              +{viewers.length - 3}
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-slate-200 font-medium leading-snug mb-2">{task.title}</p>

      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <DueDateLabel dueDate={task.dueDate} />
      </div>

      <div className="mt-2 flex items-center justify-end">
        <Avatar userId={task.assigneeId} size={22} />
      </div>
    </div>
  );
}