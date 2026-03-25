import { useState, useEffect, useRef } from 'react';
import type { CollabUser, Task } from '../types';
import { INITIAL_TASKS } from '../data/seed';

const COLLAB_USERS: Omit<CollabUser, 'currentTaskId'>[] = [
  { id: 'c1', name: 'Maya R.',  color: '#a78bfa' },
  { id: 'c2', name: 'Sam K.',   color: '#34d399' },
  { id: 'c3', name: 'Priya N.', color: '#fb7185' },
  { id: 'c4', name: 'Tomás D.', color: '#fbbf24' },
];

const POOL_IDS = INITIAL_TASKS.slice(0, 80).map((t) => t.id);

function pickDifferent(pool: string[], current: string | null): string {
  const filtered = pool.filter((id) => id !== current);
  return filtered[Math.floor(Math.random() * filtered.length)] ?? pool[0];
}

export function useCollaboration(filteredTasks: Task[]): CollabUser[] {
  const [users, setUsers] = useState<CollabUser[]>(() =>
    COLLAB_USERS.map((u) => ({
      ...u,
      currentTaskId: POOL_IDS[Math.floor(Math.random() * POOL_IDS.length)],
    }))
  );

  const poolRef = useRef<string[]>(POOL_IDS);
  useEffect(() => {
    poolRef.current = filteredTasks.length >= 5
      ? filteredTasks.map((t) => t.id)
      : POOL_IDS;
  }, [filteredTasks]);

  useEffect(() => {
    const id = setInterval(() => {
      setUsers((prev) =>
        prev.map((u) => {
          if (Math.random() > 0.4) return u;
          return { ...u, currentTaskId: pickDifferent(poolRef.current, u.currentTaskId) };
        })
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return users;
}