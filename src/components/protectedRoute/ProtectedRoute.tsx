import { ElementType, FC } from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

import { isAuthenticated } from 'slices/userSlice';

interface ProtectedRouteProps {
  element: ElementType;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ element: Element, ...props }) => {
  const Authenticated = useSelector(isAuthenticated);

  if (!Authenticated) {
    return <Navigate to="/" />;
  }

  return <Element {...props} />;
};
