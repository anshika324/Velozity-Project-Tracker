import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Chen',    color: '#6366f1' },
  { id: 'u2', name: 'Bob Martin',   color: '#ec4899' },
  { id: 'u3', name: 'Carol Smith',  color: '#14b8a6' },
  { id: 'u4', name: 'David Lee',    color: '#f97316' },
  { id: 'u5', name: 'Emma Wilson',  color: '#8b5cf6' },
  { id: 'u6', name: 'Frank Torres', color: '#22c55e' },
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[]     = ['todo', 'in-progress', 'in-review', 'done'];

const TITLE_PREFIXES = [
  'Implement', 'Refactor', 'Fix', 'Add', 'Remove', 'Update', 'Design',
  'Review', 'Test', 'Deploy', 'Migrate', 'Optimize', 'Integrate', 'Document',
  'Analyse', 'Investigate', 'Create', 'Configure', 'Validate', 'Audit',
];

const TITLE_SUBJECTS = [
  'user authentication flow', 'payment gateway integration', 'API rate limiting',
  'database schema', 'error handling middleware', 'caching layer', 'CI/CD pipeline',
  'onboarding wizard', 'search functionality', 'notification system',
  'dashboard analytics', 'role-based access control', 'file upload service',
  'email templates', 'mobile responsiveness', 'accessibility audit',
  'dark mode support', 'performance profiling', 'data export feature',
  'webhook endpoints', 'SSO integration', 'audit logging', 'reporting module',
  'customer feedback form', 'admin panel', 'billing system', 'API documentation',
  'unit test coverage', 'load testing', 'security review', 'data migration script',
  'third-party SDK', 'internationalisation', 'feature flags', 'A/B testing setup',
  'real-time sync', 'offline support', 'push notifications', 'two-factor auth',
  'session management', 'content delivery', 'image optimisation', 'SEO metadata',
  'GraphQL schema', 'REST endpoints', 'microservice extraction', 'monitoring alerts',
  'log aggregation', 'backup strategy', 'disaster recovery plan', 'SSL certificates',
];

function rnd<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function isoToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function generateTasks(count = 500): Task[] {
  const today = isoToday();
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const priority = rnd(PRIORITIES);
    const status   = rnd(STATUSES);
    const assignee = rnd(USERS);

    // Due date: spread across -30 to +60 days from today (ensures overdue tasks)
    const dueDaysOffset = Math.floor(Math.random() * 91) - 30;
    const dueDate = addDays(today, dueDaysOffset);

    // Start date: 30% chance of missing, otherwise 7-21 days before due
    const hasStart = Math.random() > 0.3;
    const startDate = hasStart
      ? addDays(dueDate, -(Math.floor(Math.random() * 15) + 7))
      : null;

    const prefix  = rnd(TITLE_PREFIXES);
    const subject = rnd(TITLE_SUBJECTS);
    const title   = `${prefix} ${subject}`;

    tasks.push({
      id:         `task-${i + 1}`,
      title:      title.charAt(0).toUpperCase() + title.slice(1),
      assigneeId: assignee.id,
      priority,
      status,
      startDate,
      dueDate,
    });
  }

  return tasks;
}

export const INITIAL_TASKS = generateTasks(500);
