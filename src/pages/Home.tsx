import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { editUser, selectUsers, toggleCompleted } from 'slices/userSlice';
import { UserList } from 'components';
import { UserData } from 'models';
import { TodoModal } from 'components/todomodal';

export const Home = () => {
  const users = useSelector(selectUsers);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const dispatch = useDispatch();

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
  };
  const handleAddTodo = (todoText: string) => {
    if (selectedUser) {
      const newTodo = { id: Date.now(), text: todoText, completed: false };
      const updatedTodos = [...(selectedUser.todos || []), newTodo];
      dispatch(editUser({ ...selectedUser, todos: updatedTodos }));
      setSelectedUser({
        ...selectedUser,
        todos: updatedTodos,
      });
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    if (selectedUser) {
      const updatedTodos = selectedUser.todos?.filter((todo) => todo.id !== todoId);
      dispatch(editUser({ ...selectedUser, todos: updatedTodos }));
      setSelectedUser({
        ...selectedUser,
        todos: updatedTodos,
      });
    }
  };

  const handleToggleCompleted = (todoId: number) => {
    if (selectedUser) {
      const updatedTodos = selectedUser.todos?.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );

      setSelectedUser({ ...selectedUser, todos: updatedTodos });

      dispatch(toggleCompleted({ userId: selectedUser.id, todoId }));
    }
  };

  const handleEditTodo = (todoId: number, newText: string) => {
    if (selectedUser) {
      const updatedTodos = selectedUser.todos?.map((todo) => (todo.id === todoId ? { ...todo, text: newText } : todo));
      dispatch(editUser({ ...selectedUser, todos: updatedTodos }));
      setSelectedUser({
        ...selectedUser,
        todos: updatedTodos,
      });
    }
  };
  return (
    <div className="container mx-auto p-4">
      <UserList users={users} onUserSelect={handleSelectUser} />
      {selectedUser && (
        <TodoModal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          onAddTodo={handleAddTodo}
          onDeleteTodo={handleDeleteTodo}
          onToggleCompleted={handleToggleCompleted}
          onEditTodo={handleEditTodo}
        />
      )}
    </div>
  );
};
