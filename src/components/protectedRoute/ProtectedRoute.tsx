import { ElementType, FC } from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from 'slices/userSlice';

interface ProtectedRouteProps {
  element: ElementType;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ element: Element, ...props }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Element {...props} />;
};
