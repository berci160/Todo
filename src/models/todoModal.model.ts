import { UserData } from './user.model';

export interface TodoModalModel {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onAddTodo: (todoText: string) => void;
  onDeleteTodo: (todoId: number) => void;
  onToggleCompleted: (todoId: number, completed: boolean) => void;
  onEditTodo:(todoId:number, newText: string)=>void;
}
