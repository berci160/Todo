import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addUser, deleteUser, editUser } from 'slices/userSlice';
import { editTodoInUser } from 'slices/todoSlice';
import { RootState } from 'store/todoStore';
import { UserData } from 'models';
import { TodoModal } from 'components/todomodal';

import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);

  const [newUserName, setNewUserName] = useState('');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editProfilePic, setEditProfilePic] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newId = Date.now();
      dispatch(addUser({ id: newId, name: newUserName, profilePic: null }));
      setNewUserName('');
    }
  };

  const handleEditUser = () => {
    if (editUserId !== null && editUserName.trim()) {
      dispatch(editUser({ id: editUserId, name: editUserName, profilePic: editProfilePic }));
      setEditUserId(null);
      setEditUserName('');
      setEditProfilePic('');
    }
  };

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (id: number) => {
    dispatch(deleteUser(id));
  };

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setEditProfilePic(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
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

  const handleAddTodo = (todoText: string) => {
    if (selectedUser) {
      const newTodo = { id: Date.now(), text: todoText, completed: false };
      const updatedTodos = selectedUser.todos ? [...selectedUser.todos, newTodo] : [newTodo];
      dispatch(editUser({ ...selectedUser, todos: updatedTodos }));
      setSelectedUser({
        ...selectedUser,
        todos: updatedTodos,
      });
    }
  };

  const handleToggleCompleted = (todoId: number, completed: boolean) => {
    if (selectedUser) {
      const updatedTodos = selectedUser.todos?.map((todo) => (todo.id === todoId ? { ...todo, completed } : todo));
      dispatch(editUser({ ...selectedUser, todos: updatedTodos }));
      setSelectedUser({ ...selectedUser, todos: updatedTodos });
    }
  };

  const handleEditTodo = (todoId: number, newText: string) => {
    if (selectedUser) {
      dispatch(editTodoInUser({ userId: selectedUser.id, todoId, newText }));
      const updatedTodos = selectedUser.todos?.map((todo) => (todo.id === todoId ? { ...todo, text: newText } : todo));
      setSelectedUser({ ...selectedUser, todos: updatedTodos });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="border p-2 rounded-lg w1/2 mr-4 bg-yellow-50"
        />
        <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add User
        </button>
      </div>

      {editUserId !== null && (
        <div className="flex flex-col items-center mb-6">
          <input
            className="border p-2 rounded-lg w-1/2 mb-4"
            type="text"
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />
          <input className="mb-4" type="file" accept="image/*" onChange={handleProfilePicChange} />
          {editProfilePic && (
            <img
              className="w-24 h-24 rounded-full mb-4"
              src={editProfilePic}
              style={{ width: '100px', height: '100px' }}
            />
          )}
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleEditUser}>
            Save Changes
          </button>
        </div>
      )}

      <div>
        {users.map((user: UserData) => (
          <div
            key={user.id}
            className=" flex items-center justify-between mb-4 p-4 border rounded-lg shadow-md bg-lime-100"
          >
            <div className="flex items-center">
              <img
                className="w-16 h-16 rounded-full mr-4"
                src={user.profilePic || import.meta.env.VITE_NO_PROFILE_PIC}
                alt={`${user.name}`}
                onClick={() => handleSelectUser(user)}
              />
              <span className="font-semibold" onClick={() => handleSelectUser(user)}>
                {user.name}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                onClick={() => {
                  setEditUserId(user.id);
                  setEditUserName(user.name);
                }}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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

export default App;
