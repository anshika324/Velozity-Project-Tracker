import { useRef, useState, useCallback, useMemo } from 'react';
import type { Task, Status } from '../../types';
import { useStore } from '../../store';
import { PriorityBadge } from '../shared/PriorityBadge';
import { Avatar } from '../shared/Avatar';
import { DueDateLabel } from '../shared/DueDateLabel';
import { PRIORITY_ORDER, STATUS_LABELS } from '../../utils/date';

const ROW_HEIGHT  = 52;
const BUFFER_ROWS = 5;
const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
type SortField = 'title' | 'priority' | 'dueDate';

interface Props { filteredTasks: Task[] }

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <span className="text-slate-600 ml-1">⇅</span>;
  return <span className="text-indigo-400 ml-1">{dir === 'asc' ? '↑' : '↓'}</span>;
}

export function ListView({ filteredTasks }: Props) {
  const sort         = useStore((s) => s.sort);
  const setSort      = useStore((s) => s.setSort);
  const updateStatus = useStore((s) => s.updateTaskStatus);
  const clearFilters = useStore((s) => s.clearFilters);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop]             = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    ro.observe(node);
  }, []);

  const sorted = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let cmp = 0;
      if (sort.field === 'title')    cmp = a.title.localeCompare(b.title);
      if (sort.field === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sort.field === 'dueDate')  cmp = a.dueDate.localeCompare(b.dueDate);
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [filteredTasks, sort]);

  const totalHeight  = sorted.length * ROW_HEIGHT;
  const startIndex   = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS);
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER_ROWS * 2;
  const endIndex     = Math.min(sorted.length, startIndex + visibleCount);
  const visibleTasks = sorted.slice(startIndex, endIndex);
  const offsetY      = startIndex * ROW_HEIGHT;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const COLS: { key: SortField | 'assignee' | 'status'; label: string; sortable?: boolean; width: string }[] = [
    { key: 'title',    label: 'Title',    sortable: true,  width: 'flex-1 min-w-[200px]' },
    { key: 'assignee', label: 'Assignee', sortable: false, width: 'w-32' },
    { key: 'priority', label: 'Priority', sortable: true,  width: 'w-28' },
    { key: 'dueDate',  label: 'Due Date', sortable: true,  width: 'w-32' },
    { key: 'status',   label: 'Status',   sortable: false, width: 'w-36' },
  ];

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-24">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-slate-400 text-lg font-medium mb-2">No tasks match your filters</p>
        <p className="text-slate-600 text-sm mb-6">Try adjusting your filters to see more results</p>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center bg-slate-900 border-b border-slate-700 px-4 py-2 flex-shrink-0">
        {COLS.map((col) => (
          <div key={col.key} className={`${col.width} flex items-center`}>
            {col.sortable ? (
              <button
                onClick={() => setSort(col.key as SortField)}
                className={`text-xs font-semibold uppercase tracking-wider flex items-center hover:text-indigo-300 transition-colors ${
                  sort.field === col.key ? 'text-indigo-400' : 'text-slate-500'
                }`}
              >
                {col.label}
                <SortIcon active={sort.field === col.key} dir={sort.dir} />
              </button>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{col.label}</span>
            )}
          </div>
        ))}
      </div>

      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          measuredRef(node);
        }}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
        style={{ overflowAnchor: 'none' }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
            {visibleTasks.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                onStatusChange={updateStatus}
                striped={(startIndex + i) % 2 === 1}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-2 text-xs text-slate-600 flex-shrink-0">
        Showing {sorted.length} tasks · Rendering rows {startIndex + 1}–{endIndex} of {sorted.length}
      </div>
    </div>
  );
}

function TaskRow({ task, onStatusChange, striped }: {
  task: Task;
  onStatusChange: (id: string, s: Status) => void;
  striped: boolean;
}) {
  return (
    <div
      className={`flex items-center px-4 border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors ${striped ? 'bg-slate-900/30' : ''}`}
      style={{ height: ROW_HEIGHT }}
    >
      <div className="flex-1 min-w-[200px] pr-4">
        <span className="text-sm text-slate-200 truncate block">{task.title}</span>
      </div>
      <div className="w-32"><Avatar userId={task.assigneeId} size={26} /></div>
      <div className="w-28"><PriorityBadge priority={task.priority} /></div>
      <div className="w-32"><DueDateLabel dueDate={task.dueDate} /></div>
      <div className="w-36">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-full cursor-pointer"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}