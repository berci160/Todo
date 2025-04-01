import { Middleware } from '@reduxjs/toolkit';

import {
  deleteUser,
  editUser,
  login,
  logout,
  registerUser,
  selectLoggedInUser,
  toggleCompleted,
} from 'slices/userSlice';
import { ActivityType, logActivity } from 'services/activity.logger.service';
import { CURRENT_USER, LOCAL_USERS } from 'config/config';

type UserActions =
  | ReturnType<typeof login>
  | ReturnType<typeof logout>
  | ReturnType<typeof registerUser>
  | ReturnType<typeof editUser>
  | ReturnType<typeof toggleCompleted>
  | ReturnType<typeof deleteUser>;

const userActivityMiddleware = ((store) => (next) => (action) => {
  const typedAction = action as UserActions;
  const result = next(typedAction);
  const currentUser = selectLoggedInUser(store.getState());

  if (typedAction.type === registerUser.type) {
    logActivity({
      type: ActivityType.CREATE,
      userName: typedAction.payload.name,
    });
  }

  if (typedAction.type === login.type) {
    logActivity({
      type: ActivityType.LOGIN,
      userName: typedAction.payload.name,
    });
  }

  if (typedAction.type === logout.type) {
    const currentUserBefore = localStorage.getItem(CURRENT_USER);
    if (currentUserBefore) {
      const currentUserParsed = JSON.parse(currentUserBefore);

      logActivity({
        type: ActivityType.LOGOUT,
        userName: currentUserParsed.name,
      });
      localStorage.removeItem(CURRENT_USER);
    }
  }

  if (typedAction.type === editUser.type) {
    logActivity({
      type: ActivityType.EDIT,
      userName: typedAction.payload.name,
    });
  }

  if (typedAction.type === deleteUser.type) {
    const users = localStorage.getItem(LOCAL_USERS);
    if (users) {
      const parsedUsers = JSON.parse(users);
      const user = parsedUsers.find(
        (deletedUser: { id: number; name: string }) => deletedUser.id === typedAction.payload
      );

      if (user) {
        logActivity({
          type: ActivityType.DELETE,
          userName: user.name,
        });
      }

      const updatedUsers = parsedUsers.filter((deletedUser: { id: number }) => deletedUser.id !== typedAction.payload);

      localStorage.setItem(LOCAL_USERS, JSON.stringify(updatedUsers));
    }
  }

  if (typedAction.type === toggleCompleted.type && currentUser) {
    logActivity({
      type: ActivityType.COMPLETE,
      userName: currentUser.name,
    });
  }
  
  return result;
}) as Middleware;

export default userActivityMiddleware;
