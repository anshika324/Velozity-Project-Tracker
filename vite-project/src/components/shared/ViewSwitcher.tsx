import { useStore } from '../../store';
import type { ViewMode } from '../../types';

const VIEWS: { key: ViewMode; label: string; icon: string }[] = [
  { key: 'kanban',   label: 'Board',    icon: '⊞' },
  { key: 'list',     label: 'List',     icon: '☰' },
  { key: 'timeline', label: 'Timeline', icon: '⊟' },
];

export function ViewSwitcher() {
  const { view, setView } = useStore();

  return (
    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
      {VIEWS.map((v) => (
        <button
          key={v.key}
          onClick={() => setView(v.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            view === v.key
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          <span className="text-base leading-none">{v.icon}</span>
          {v.label}
        </button>
      ))}
    </div>
  );
}
