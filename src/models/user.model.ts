import { TodoData } from './todo.model';

export enum AuthRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserData {
  id: number;
  name: string;
  profilePic: string | null;
  todos?: TodoData[];
  password?: string;
  role?: AuthRoles
}

export interface UserStateModel {
  users: UserData[];
  currentUser: UserData | null;
  isAuthenticated: boolean;
}
