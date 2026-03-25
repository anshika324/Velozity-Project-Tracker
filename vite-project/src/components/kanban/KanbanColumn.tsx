import type { Task, Status, CollabUser } from '../../types';
import { KanbanCard } from './KanbanCard';
import { STATUS_LABELS } from '../../utils/date';

const COLUMN_BORDER: Record<Status, string> = {
  'todo':        'border-slate-700',
  'in-progress': 'border-blue-600/50',
  'in-review':   'border-amber-600/50',
  'done':        'border-green-600/50',
};
const HEADER_COLOR: Record<Status, string> = {
  'todo':        'text-slate-300',
  'in-progress': 'text-blue-400',
  'in-review':   'text-amber-400',
  'done':        'text-green-400',
};
const COLUMN_ICON: Record<Status, string> = {
  'todo': '📋', 'in-progress': '⚡', 'in-review': '🔍', 'done': '✅',
};

interface Props {
  status: Status;
  tasks: Task[];
  collabUsers: CollabUser[];
  draggingTaskId: string | null;
  snapBackId: string | null;
  dragOverColumn: Status | null;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, status: Status) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
  onTouchStart: (e: TouchEvent, taskId: string, status: Status) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
}

export function KanbanColumn({
  status, tasks, collabUsers,
  draggingTaskId, snapBackId, dragOverColumn,
  onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
  onTouchStart, onTouchMove, onTouchEnd,
}: Props) {
  const isOver = dragOverColumn === status;

  return (
    <div
      className={`flex flex-col rounded-xl border transition-all duration-150 min-w-[280px] max-w-[320px] flex-1 ${
        COLUMN_BORDER[status]
      } ${isOver ? 'drag-over-column' : 'bg-slate-900/50'}`}
      data-column-status={status}
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
        <span className={`font-semibold text-sm ${HEADER_COLOR[status]}`}>{STATUS_LABELS[status]}</span>
        <span className="bg-slate-800 text-slate-400 text-xs rounded-full px-2 py-0.5 font-medium tabular-nums">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0"
        style={{ maxHeight: 'calc(100vh - 210px)' }}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center select-none">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center mb-3 text-lg">
              {COLUMN_ICON[status]}
            </div>
            <p className="text-slate-500 text-xs font-medium">No tasks</p>
            <p className="text-slate-600 text-[11px] mt-1">Drop cards here</p>
          </div>
        ) : (
          tasks.map((task) =>
            draggingTaskId === task.id ? (
              <div key={task.id} className="drag-placeholder" style={{ height: 118 }} />
            ) : (
              <KanbanCard
                key={task.id}
                task={task}
                collabUsers={collabUsers}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                isDragging={draggingTaskId === task.id}
                isSnapBack={snapBackId === task.id}
              />
            )
          )
        )}
        {isOver && draggingTaskId && (
          <div className="drag-placeholder" style={{ height: 48 }} />
        )}
      </div>
    </div>
  );
}