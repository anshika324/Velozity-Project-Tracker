import { useRef, useCallback } from 'react';
import type { Status } from '../types';

const COLUMNS: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

interface TouchDragState {
  taskId: string;
  ghost: HTMLElement;
  originX: number;
  originY: number;
  originalStatus: Status;
}

export function useTouchDrag(
  onDragStart: (taskId: string) => void,
  onDragEnd: () => void,
  onDrop: (taskId: string, status: Status) => void,
) {
  const state = useRef<TouchDragState | null>(null);

  const createGhost = useCallback((el: HTMLElement): HTMLElement => {
    const rect  = el.getBoundingClientRect();
    const ghost = el.cloneNode(true) as HTMLElement;
    ghost.style.cssText = `
      position:fixed;
      left:${rect.left}px;top:${rect.top}px;
      width:${rect.width}px;
      pointer-events:none;z-index:9999;
      opacity:0.85;
      transform:rotate(2deg) scale(1.03);
      box-shadow:0 20px 40px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(ghost);
    return ghost;
  }, []);

  const getColumnAtPoint = useCallback((x: number, y: number): Status | null => {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      const s = (el as HTMLElement).dataset.columnStatus as Status | undefined;
      if (s && COLUMNS.includes(s)) return s;
    }
    return null;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent, taskId: string, currentStatus: Status) => {
    if (e.touches.length !== 1) return;
    const touch  = e.touches[0];
    const target = e.currentTarget as HTMLElement;
    const rect   = target.getBoundingClientRect();
    const ghost  = createGhost(target);

    state.current = {
      taskId,
      ghost,
      originX: touch.clientX - rect.left,
      originY: touch.clientY - rect.top,
      originalStatus: currentStatus,
    };
    onDragStart(taskId);
    e.preventDefault();
  }, [createGhost, onDragStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!state.current) return;
    const touch = e.touches[0];
    const { ghost, originX, originY } = state.current;
    ghost.style.left = `${touch.clientX - originX}px`;
    ghost.style.top  = `${touch.clientY - originY}px`;

    const col = getColumnAtPoint(touch.clientX, touch.clientY);
    document.querySelectorAll('[data-column-status]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.dataset.columnStatus === col) {
        htmlEl.classList.add('drag-over-column');
      } else {
        htmlEl.classList.remove('drag-over-column');
      }
    });
    e.preventDefault();
  }, [getColumnAtPoint]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!state.current) return;
    const { ghost, taskId, originalStatus } = state.current;
    const touch = e.changedTouches[0];
    const col   = getColumnAtPoint(touch.clientX, touch.clientY);

    if (col && col !== originalStatus) {
      ghost.remove();
      onDrop(taskId, col);
    } else if (col === originalStatus) {
      ghost.remove();
    } else {
      // snap back
      ghost.style.transition = 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)';
      ghost.style.opacity = '0';
      ghost.style.transform = 'scale(0.9)';
      setTimeout(() => ghost.remove(), 320);
    }

    document.querySelectorAll('[data-column-status]').forEach((el) => {
      (el as HTMLElement).classList.remove('drag-over-column');
    });
    state.current = null;
    onDragEnd();
  }, [getColumnAtPoint, onDrop, onDragEnd]);

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
