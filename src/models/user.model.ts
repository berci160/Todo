import { TodoData } from './todo.model';
export interface UserData {
  id: number;
  name: string;
  profilePic: string | null;
  todos?: TodoData[];
}

export interface UserStateModel {
  users: UserData[];
}
