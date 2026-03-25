import { useEffect } from 'react';
import { useStore, hasActiveFilters } from '../store';
import type { FilterState, ViewMode } from '../types';

function parseArray(val: string | null): string[] {
  if (!val) return [];
  return val.split(',').filter(Boolean);
}

export function useUrlSync() {
  const { filters, view, setFilters, setView } = useStore();

  // On mount: read URL → store
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const parsed: Partial<FilterState> = {};
    const s = parseArray(p.get('status'));
    const pr = parseArray(p.get('priority'));
    const as = parseArray(p.get('assignee'));
    if (s.length)  parsed.status   = s as FilterState['status'];
    if (pr.length) parsed.priority = pr as FilterState['priority'];
    if (as.length) parsed.assignee = as;
    if (p.get('from')) parsed.dueDateFrom = p.get('from')!;
    if (p.get('to'))   parsed.dueDateTo   = p.get('to')!;
    if (Object.keys(parsed).length) setFilters(parsed);
    const v = p.get('view') as ViewMode | null;
    if (v && ['kanban','list','timeline'].includes(v)) setView(v);
  }, []);

  // On filter/view change: push to URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (view !== 'kanban') p.set('view', view);
    if (filters.status.length)   p.set('status',   filters.status.join(','));
    if (filters.priority.length) p.set('priority', filters.priority.join(','));
    if (filters.assignee.length) p.set('assignee', filters.assignee.join(','));
    if (filters.dueDateFrom)     p.set('from', filters.dueDateFrom);
    if (filters.dueDateTo)       p.set('to',   filters.dueDateTo);
    const qs = p.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  }, [filters, view]);
}

export { hasActiveFilters };
