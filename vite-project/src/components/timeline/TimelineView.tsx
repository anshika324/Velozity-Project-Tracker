import { useMemo } from 'react';
import type { Task } from '../../types';
import { PRIORITY_DOT_COLORS } from '../../utils/date';

const ROW_H   = 36;
const LABEL_W = 200;
const DAY_W   = 32;

interface Props { filteredTasks: Task[] }

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function TimelineView({ filteredTasks }: Props) {
  const now        = new Date();
  const year       = now.getFullYear();
  const month      = now.getMonth();
  const days       = daysInMonth(year, month);
  const dayNums    = Array.from({ length: days }, (_, i) => i + 1);
  const monthStart = new Date(year, month, 1);
  const monthEnd   = new Date(year, month, days);
  const todayIdx   = now.getDate() - 1;
  const totalWidth = LABEL_W + days * DAY_W;

  const rows = useMemo(() => {
    return filteredTasks.map((task) => {
      const dueD    = parseDate(task.dueDate);
      const startD  = task.startDate ? parseDate(task.startDate) : dueD;
      const visible = !(dueD < monthStart || startD > monthEnd);
      const barStart  = startD < monthStart ? monthStart : startD;
      const barEnd    = dueD   > monthEnd   ? monthEnd   : dueD;
      const startDay  = barStart.getDate() - 1;
      const endDay    = barEnd.getDate() - 1;
      const isSingleDay = !task.startDate;
      const x     = LABEL_W + startDay * DAY_W;
      const width = isSingleDay ? DAY_W : Math.max(DAY_W, (endDay - startDay + 1) * DAY_W);
      const color = PRIORITY_DOT_COLORS[task.priority];
      return { task, x, width, color, visible, isSingleDay };
    });
  }, [filteredTasks, year, month, days]);

  const visibleRows = rows.filter((r) => r.visible);

  if (visibleRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-24">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-slate-400 text-lg font-medium mb-2">No tasks in this month</p>
        <p className="text-slate-600 text-sm">
          Tasks with due dates in {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div style={{ width: totalWidth, minWidth: '100%' }}>
        <div className="mb-2 text-slate-400 text-sm font-semibold">
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          <span className="ml-3 text-slate-600 text-xs font-normal">{visibleRows.length} tasks</span>
        </div>

        <div className="flex border-b border-slate-700 sticky top-0 bg-slate-950 z-10" style={{ paddingLeft: LABEL_W }}>
          {dayNums.map((d) => {
            const isToday   = d - 1 === todayIdx;
            const isWeekend = new Date(year, month, d).getDay() % 6 === 0;
            return (
              <div key={d} style={{ width: DAY_W, flexShrink: 0 }}
                className={`text-center text-xs py-1.5 font-medium ${
                  isToday ? 'text-indigo-400 font-bold' : isWeekend ? 'text-slate-600' : 'text-slate-500'
                }`}
              >{d}</div>
            );
          })}
        </div>

        <div className="relative">
          {dayNums.map((d) => {
            if (new Date(year, month, d).getDay() % 6 !== 0) return null;
            return (
              <div key={d} className="absolute top-0 bg-slate-800/20 pointer-events-none"
                style={{ left: LABEL_W + (d - 1) * DAY_W, width: DAY_W, height: visibleRows.length * ROW_H }} />
            );
          })}

          <div className="absolute top-0 z-20 pointer-events-none"
            style={{
              left: LABEL_W + todayIdx * DAY_W + DAY_W / 2,
              width: 2, height: visibleRows.length * ROW_H,
              background: 'rgba(99,102,241,0.8)',
              boxShadow: '0 0 8px rgba(99,102,241,0.4)',
            }} />

          {visibleRows.map(({ task, x, width, color, isSingleDay }) => (
            <div key={task.id}
              className="flex items-center border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group"
              style={{ height: ROW_H }}
            >
              <div className="flex-shrink-0 px-3 flex items-center gap-2" style={{ width: LABEL_W }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-xs text-slate-300 truncate group-hover:text-white transition-colors">{task.title}</span>
              </div>
              <div className="relative flex-1" style={{ height: ROW_H }}>
                <div className="absolute top-1/2 -translate-y-1/2 rounded flex items-center px-1.5 overflow-hidden"
                  style={{
                    left: x - LABEL_W, width: isSingleDay ? DAY_W - 4 : width - 4,
                    height: ROW_H - 14, background: `${color}22`, border: `1px solid ${color}66`,
                  }}
                  title={`${task.title} · ${task.startDate ?? task.dueDate} → ${task.dueDate}`}
                >
                  {isSingleDay
                    ? <div className="w-2 h-2 rounded-full mx-auto" style={{ background: color }} />
                    : <span className="text-[10px] font-medium truncate" style={{ color }}>{task.title}</span>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}