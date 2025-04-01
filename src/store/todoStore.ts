import { configureStore } from '@reduxjs/toolkit';

import userActivityMiddleware from 'middleware/activityMiddleware';

import userReducer from '../slices/userSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userActivityMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
