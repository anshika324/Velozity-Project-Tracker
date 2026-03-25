import { useStore, hasActiveFilters } from '../../store';
import { USERS } from '../../data/seed';
import type { Status, Priority } from '../../types';

const STATUSES: { value: Status; label: string }[] = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review',   label: 'In Review' },
  { value: 'done',        label: 'Done' },
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high',     label: 'High' },
  { value: 'medium',   label: 'Medium' },
  { value: 'low',      label: 'Low' },
];

function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (val: T[]) => void;
}) {
  const toggle = (val: T) => {
    onChange(
      selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]
    );
  };
  return (
    <div className="flex flex-col gap-1 min-w-[130px]">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              onClick={() => toggle(o.value)}
              className={`px-2 py-0.5 rounded text-xs font-medium border transition-all ${
                active
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FilterBar() {
  const { filters, setFilters, clearFilters } = useStore();
  const active = hasActiveFilters(filters);

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
      <div className="flex flex-wrap items-end gap-4">
        <MultiSelect
          label="Status"
          options={STATUSES}
          selected={filters.status}
          onChange={(v) => setFilters({ status: v as Status[] })}
        />
        <MultiSelect
          label="Priority"
          options={PRIORITIES}
          selected={filters.priority}
          onChange={(v) => setFilters({ priority: v as Priority[] })}
        />
        <MultiSelect
          label="Assignee"
          options={USERS.map((u) => ({ value: u.id, label: u.name.split(' ')[0] }))}
          selected={filters.assignee}
          onChange={(v) => setFilters({ assignee: v })}
        />

        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Due Date</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dueDateFrom}
              onChange={(e) => setFilters({ dueDateFrom: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500 text-xs">→</span>
            <input
              type="date"
              value={filters.dueDateTo}
              onChange={(e) => setFilters({ dueDateTo: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {active && (
          <button
            onClick={clearFilters}
            className="ml-auto px-3 py-1.5 rounded text-xs font-semibold bg-red-900/40 border border-red-700/50 text-red-300 hover:bg-red-800/40 transition-all"
          >
            ✕ Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
