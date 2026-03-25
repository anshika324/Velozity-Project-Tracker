import { create } from 'zustand';
import type { Task, FilterState, SortState, ViewMode, Status } from '../types';
import { INITIAL_TASKS } from '../data/seed';

interface AppState {
  tasks: Task[];
  view: ViewMode;
  filters: FilterState;
  sort: SortState;
  setView: (v: ViewMode) => void;
  setFilters: (f: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSort: (field: SortState['field']) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
}

export const DEFAULT_FILTERS: FilterState = {
  status: [], priority: [], assignee: [], dueDateFrom: '', dueDateTo: '',
};

export const useStore = create<AppState>((set) => ({
  tasks: INITIAL_TASKS,
  view: 'kanban',
  filters: DEFAULT_FILTERS,
  sort: { field: 'dueDate', dir: 'asc' },
  setView: (view) => set({ view }),
  setFilters: (partial) => set((s) => ({ filters: { ...s.filters, ...partial } })),
  clearFilters: () => set({ filters: DEFAULT_FILTERS }),
  setSort: (field) => set((s) => ({
    sort: { field, dir: s.sort.field === field && s.sort.dir === 'asc' ? 'desc' : 'asc' },
  })),
  moveTask: (taskId, newStatus) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t),
  })),
  updateTaskStatus: (taskId, status) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === taskId ? { ...t, status } : t),
  })),
}));

export function getFilteredTasks(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter((t) => {
    if (filters.status.length   && !filters.status.includes(t.status))       return false;
    if (filters.priority.length && !filters.priority.includes(t.priority))   return false;
    if (filters.assignee.length && !filters.assignee.includes(t.assigneeId)) return false;
    if (filters.dueDateFrom && t.dueDate < filters.dueDateFrom) return false;
    if (filters.dueDateTo   && t.dueDate > filters.dueDateTo)   return false;
    return true;
  });
}

export function hasActiveFilters(f: FilterState): boolean {
  return f.status.length > 0 || f.priority.length > 0 || f.assignee.length > 0 ||
    f.dueDateFrom !== '' || f.dueDateTo !== '';
}