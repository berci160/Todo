export interface TodoData {
  id: number;
  text: string;
  completed: boolean;
  userId: number;
}

export interface TodoStateModel {
  todos: TodoData[];
}
