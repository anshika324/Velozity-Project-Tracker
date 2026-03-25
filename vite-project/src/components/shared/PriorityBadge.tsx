import { PRIORITY_COLORS } from '../../utils/date';
import type { Priority } from '../../types';

interface Props {
  priority: Priority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'sm' }: Props) {
  const cls = PRIORITY_COLORS[priority];
  const px  = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded font-semibold uppercase tracking-wide ${px} ${cls}`}>
      {priority}
    </span>
  );
}
