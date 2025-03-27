import React from 'react';
import { Navigate } from 'react-router';
import { useSelector, } from 'react-redux';

import { RootState } from 'store/todoStore';
interface ProtectedRouteProps {
  element: React.ElementType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Element, ...rest }) => {
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Element {...rest} />;
};
