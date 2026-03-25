export function isoToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysDiff(dateStr: string): number {
  const today = new Date(isoToday());
  const date  = new Date(dateStr);
  return Math.floor((today.getTime() - date.getTime()) / 86400000);
}

export function formatDueDate(dueDate: string): { label: string; isOverdue: boolean; isDueToday: boolean } {
  const diff = daysDiff(dueDate);
  const isOverdue   = diff > 0;
  const isDueToday  = diff === 0;

  if (isDueToday) return { label: 'Due Today', isOverdue: false, isDueToday: true };
  if (isOverdue && diff > 7) return { label: `${diff}d overdue`, isOverdue: true, isDueToday: false };
  if (isOverdue) return { label: formatDate(dueDate), isOverdue: true, isDueToday: false };
  return { label: formatDate(dueDate), isOverdue: false, isDueToday: false };
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export function getMonthDays(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500 text-red-50',
  high:     'bg-orange-500 text-orange-50',
  medium:   'bg-yellow-500 text-yellow-900',
  low:      'bg-green-500 text-green-50',
};

export const PRIORITY_DOT_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};

export const STATUS_LABELS: Record<string, string> = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'in-review':   'In Review',
  'done':        'Done',
};
