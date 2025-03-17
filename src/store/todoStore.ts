import { configureStore } from '@reduxjs/toolkit';

import todoreducer from '../slices/todoSlice';
import userreducer from '../slices/userSlice';

const store = configureStore({
  reducer: {
    todos: todoreducer,
    users: userreducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;