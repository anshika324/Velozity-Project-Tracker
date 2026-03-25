export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  status: Status;
  startDate: string | null; // ISO date string
  dueDate: string;          // ISO date string
  description?: string;
}

export interface FilterState {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDir = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  dir: SortDir;
}

export type ViewMode = 'kanban' | 'list' | 'timeline';

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  currentTaskId: string | null;
}
