import { TodoData } from './todo.model';

export enum AuthRoles {
  admin = 'admin',
  user = 'user',
}

export interface UserData {
  id: number;
  name: string;
  profilePic: string | null;
  todos?: TodoData[];
  password?: string;
  role?: AuthRoles.admin | AuthRoles.user;
}

export interface UserStateModel {
  users: UserData[];
  currentUser: UserData | null;
  isAuthenticated: boolean;
}
