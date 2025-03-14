import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserData, UserStateModel } from 'models';
import { LOCAL_USERS } from 'config/config';

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
    
    addUser: (state, action: PayloadAction<{ id: number; name: string }>) => {

      const { id, name } = action.payload;
      const newUser: UserData = {
        id,
        name,
        profilePic: null,
        todos: [],
      };
      state.users.push(newUser);
      localStorage.setItem(`${LOCAL_USERS}-${id}`, JSON.stringify(newUser));
    },

    editUser: (state, action: PayloadAction<{ id: number; name: string }>) => {

      const { id, name } = action.payload;
      const editUser = state.users.find((user) => user.id === id);
      if (editUser) {
        editUser.name = name;
        localStorage.setItem(`${LOCAL_USERS}-${id}`, JSON.stringify(editUser));
      }
    },

    deleteUser: (state, action: PayloadAction<number>) => {

      const updatedUsers = state.users.filter((user)=>user.id !==action.payload);
      if(updatedUsers.length!==state.users.length)
      {
        state.users=updatedUsers;
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
  },
});

export const { addUser, editUser, deleteUser, setProfilePic } = userSlice.actions;
export default userSlice.reducer;
