import { ACTIVITY_LOG_KEY } from 'config/config';

export enum ActivityType {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  COMPLETE = 'complete',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export interface ActivityLogProps {
  id: string;
  type: ActivityType;
  userName: string;
  timestamp: string;
}

export const logActivity = (entry: Omit<ActivityLogProps, 'id' | 'timestamp'>) => {
  const log: ActivityLogProps[] = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]');

  const newEntry: ActivityLogProps = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  log.push(newEntry);
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
};

export const getActivityLog = (): ActivityLogProps[] => {
  return JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]');
};

export const clearActivityLog = () => {
  localStorage.removeItem(ACTIVITY_LOG_KEY);
};
