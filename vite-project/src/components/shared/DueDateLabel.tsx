import { formatDueDate } from '../../utils/date';

interface Props { dueDate: string }

export function DueDateLabel({ dueDate }: Props) {
  const { label, isOverdue, isDueToday } = formatDueDate(dueDate);
  let cls = 'text-slate-400';
  if (isOverdue)  cls = 'text-red-400 font-medium';
  if (isDueToday) cls = 'text-amber-400 font-medium';
  return <span className={`text-xs ${cls}`}>{label}</span>;
}
