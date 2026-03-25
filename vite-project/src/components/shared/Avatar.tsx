import { USERS } from '../../data/seed';
import { getInitials } from '../../utils/date';

interface Props {
  userId: string;
  size?: number;
  className?: string;
}

export function Avatar({ userId, size = 28, className = '' }: Props) {
  const user = USERS.find((u) => u.id === userId);
  if (!user) return null;
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white select-none ${className}`}
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.38 }}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
}
