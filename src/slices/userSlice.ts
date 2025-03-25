import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserData, UserStateModel } from 'models';
import { LOCAL_USERS } from 'config/config';
import { RootState } from 'store/todoStore';

const loadUsersFromLocalStorage = (): UserData[] => {
  const users: UserData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_USERS)) {
      const savedUser = localStorage.getItem(key);
      if (savedUser) {
        users.push(JSON.parse(savedUser));
      }
    }
  }
  return users;
};

const initialState: UserStateModel = {
  users: loadUsersFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{ id: number; name: string; profilePic: string | null }>) => {
      const { id, name, profilePic } = action.payload;
      const newUser: UserData = {
        id,
        name,
        profilePic: profilePic || null,
        todos: [],
      };
      state.users.push(newUser);
      localStorage.setItem(`${LOCAL_USERS}-${id}`, JSON.stringify(newUser));
    },

    editUser: (
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        profilePic: string | null;
        todos?: { id: number; text: string; completed: boolean }[];
      }>
    ) => {
      const { id, name, profilePic, todos } = action.payload;

      const editUser = state.users.find((user) => user.id === id);

      if (editUser) {
        editUser.name = name;
        editUser.profilePic = profilePic;

        if (todos) {
          editUser.todos = todos;
        }
        localStorage.setItem(`${LOCAL_USERS}-${id}`, JSON.stringify(editUser));
      }
    },

    deleteUser: (state, action: PayloadAction<number>) => {
      const updatedUsers = state.users.filter((user) => user.id !== action.payload);

      if (updatedUsers.length !== state.users.length) {
        state.users = updatedUsers;
        localStorage.removeItem(`${LOCAL_USERS}-${action.payload}`);
      }
    },

    setProfilePic: (state, action: PayloadAction<{ id: number; profilePic: string }>) => {
      const { id, profilePic } = action.payload;
      const setUserProfilePic = state.users.find((user) => user.id === id);
      if (setUserProfilePic) {
        setUserProfilePic.profilePic = profilePic;
        localStorage.setItem(`${LOCAL_USERS}-${id}`, JSON.stringify(setUserProfilePic));
      }
    },
    toggleCompleted: (state, action: PayloadAction<{ userId: number; todoId: number }>) => {
      const { userId, todoId } = action.payload;

      const currentUser = state.users.find((user) => user.id === userId);
      if (currentUser) {
        const curentTodo = currentUser.todos?.find((todo) => todo.id === todoId);
        if (curentTodo) {
          curentTodo.completed = !curentTodo.completed;
          localStorage.setItem(`${LOCAL_USERS}-${userId}`, JSON.stringify(currentUser));
        }
      }
    },
  },
});

export const { addUser, editUser, deleteUser, setProfilePic, toggleCompleted } = userSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;
export default userSlice.reducer;
