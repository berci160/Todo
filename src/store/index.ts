import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { commonReducer } from './common';

const reducerFallback = () => null;

export const rootReducer = combineReducers({
  common: commonReducer || reducerFallback,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

declare global {
  type ApplicationState = ReturnType<typeof rootReducer>;

  type AppDispatch = typeof store.dispatch;

  type GetState = () => ApplicationState;
}
