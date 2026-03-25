import type { CollabUser } from '../../types';
import { getInitials } from '../../utils/date';

interface Props {
  users: CollabUser[];
}

export function PresenceBar({ users }: Props) {
  const active = users.filter((u) => u.currentTaskId !== null);
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>{active.length} {active.length === 1 ? 'person' : 'people'} viewing this board</span>
      <div className="flex -space-x-1 ml-1">
        {active.map((u) => (
          <div
            key={u.id}
            title={u.name}
            className="avatar-enter w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: u.color }}
          >
            {getInitials(u.name)}
          </div>
        ))}
      </div>
    </div>
  );
}
