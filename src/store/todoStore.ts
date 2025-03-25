import { configureStore } from '@reduxjs/toolkit';

import userreducer from '../slices/userSlice';

const store = configureStore({
  reducer: {
    users: userreducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
