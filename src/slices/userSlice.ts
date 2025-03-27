import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthRoles, UserData, UserStateModel } from 'models';
import { CURRENT_USER, LOCAL_USERS } from 'config/config';
import { RootState } from 'store/todoStore';

const loadUsersFromLocalStorage = (): UserData[] => {
  const users = localStorage.getItem(LOCAL_USERS);
  return users ? JSON.parse(users) : [];
};

const initialState: UserStateModel = {
  users: loadUsersFromLocalStorage(),
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
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
        localStorage.setItem(LOCAL_USERS, JSON.stringify(state.users));
      }
    },

    deleteUser: (state, action: PayloadAction<number>) => {
      const updatedUsers = state.users.filter((user) => user.id !== action.payload);

      if (updatedUsers.length !== state.users.length) {
        state.users = updatedUsers;
        localStorage.setItem(LOCAL_USERS, JSON.stringify(state.users));
      }
    },

    setProfilePic: (state, action: PayloadAction<{ id: number; profilePic: string }>) => {
      const { id, profilePic } = action.payload;
      const setUserProfilePic = state.users.find((user) => user.id === id);
      if (setUserProfilePic) {
        setUserProfilePic.profilePic = profilePic;
        localStorage.setItem(LOCAL_USERS, JSON.stringify(state.users));
      }
    },

    toggleCompleted: (state, action: PayloadAction<{ userId: number; todoId: number }>) => {
      const { userId, todoId } = action.payload;

      const currentUser = state.users.find((user) => user.id === userId);

      if (currentUser) {
        const curentTodo = currentUser.todos?.find((todo) => todo.id === todoId);
        if (curentTodo) {
          curentTodo.completed = !curentTodo.completed;
          localStorage.setItem(LOCAL_USERS, JSON.stringify(state.users));
        }
      }
    },

    login: (
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        profilePic: string | null;
      }>
    ) => {
      const { name } = action.payload;
      const founduser = state.users.find((user) => user.name === name);
      
      if (founduser) {
        state.currentUser = {
          id: founduser.id,
          name: founduser.name,
          profilePic: founduser.profilePic,
          todos: founduser.todos,
          role: founduser.role,
        };

        state.isAuthenticated = true;
        localStorage.setItem(CURRENT_USER, JSON.stringify(state.currentUser));
      }
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem(CURRENT_USER);
    },

    registerUser: (
      state,
      action: PayloadAction<{ id: number; name: string; profilePic: string | null; password: string }>
    ) => {
      const { id, name, password } = action.payload;

      const newUser: UserData = {
        id,
        name,
        profilePic: null,
        todos: [],
        password,
        role: AuthRoles.user,
      };

      state.users.push(newUser);

      localStorage.setItem(LOCAL_USERS, JSON.stringify(state.users));

      state.currentUser = newUser;
      state.isAuthenticated = true;

      localStorage.setItem(CURRENT_USER, JSON.stringify(state.currentUser));
    },
  },
});

export const { editUser, deleteUser, setProfilePic, toggleCompleted, login, logout, registerUser } = userSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;
export default userSlice.reducer;
