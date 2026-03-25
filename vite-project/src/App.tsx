import { useMemo } from 'react';
import { useStore, getFilteredTasks } from './store';
import { useUrlSync } from './hooks/useUrlSync';
import { useCollaboration } from './hooks/useCollaboration';
import { ViewSwitcher } from './components/shared/ViewSwitcher';
import { FilterBar } from './components/filters/FilterBar';
import { PresenceBar } from './components/collaboration/PresenceBar';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';

export default function App() {
  useUrlSync();

  const view    = useStore((s) => s.view);
  const tasks   = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);

  const filteredTasks = useMemo(
    () => getFilteredTasks(tasks, filters),
    [tasks, filters]
  );

  const collabUsers = useCollaboration(filteredTasks);

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <header className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white select-none">V</div>
          <span className="font-semibold text-slate-100 text-sm tracking-tight">Project Tracker</span>
          <span className="text-slate-700 text-xs hidden sm:block">|</span>
          <span className="text-slate-500 text-xs hidden sm:block">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <ViewSwitcher />
      </header>
      <PresenceBar users={collabUsers} />
      <FilterBar />
      <main className="flex-1 overflow-hidden view-enter" key={view}>
        {view === 'kanban'   && <KanbanBoard filteredTasks={filteredTasks} collabUsers={collabUsers} />}
        {view === 'list'     && <ListView filteredTasks={filteredTasks} />}
        {view === 'timeline' && <TimelineView filteredTasks={filteredTasks} />}
      </main>
    </div>
  );
}