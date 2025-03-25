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
      const { todos = [] } = selectedUser;

      const updatedTodos = todos.filter(({ id }) => id !== todoId);

      setSelectedUser((prev) => ({ ...prev!, todos: updatedTodos }));
      dispatch(editUser({ ...selectedUser, todos: updatedTodos }));
    }
  };

  const handleToggleCompleted = (todoId: number) => {
    if (selectedUser) {
      const { todos = [], id: userId } = selectedUser;

      const updatedTodos = todos.map(({ id, completed, ...rest }) =>
        id === todoId ? { ...rest, id, completed: !completed } : { ...rest, id, completed }
      );

      setSelectedUser((prev) => ({ ...prev!, todos: updatedTodos }));
      dispatch(toggleCompleted({ userId, todoId }));
    }
  };

  const handleEditTodo = (todoId: number, newText: string) => {
    if (selectedUser) {
      const { id: userId, todos } = selectedUser;

      const updatedTodos = todos?.map(({ id, text, completed, ...rest }) =>
        id === todoId ? { ...rest, id, completed, text: newText, userId } : { ...rest, id, completed, text }
      );

      setSelectedUser({ ...selectedUser, todos: updatedTodos });
      dispatch(editUser({ ...selectedUser, todos: updatedTodos }));
    }
  };

  const handleOnClose = () => {
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto p-4">
      <UserList users={users} onUserSelect={handleSelectUser} />
      {selectedUser && (
        <TodoModal
          isOpen
          onClose={handleOnClose}
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
