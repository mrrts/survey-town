import React, { FC } from 'react';
import { useAppSelector } from '../../store';
import { getUser } from '../../store/auth/selectors';
import { Redirect, RouteComponentProps } from '@reach/router';

export interface IProtectedRouteProps extends RouteComponentProps {
}

export const ProtectedRoute: FC<IProtectedRouteProps> = ({ children }) => {
  const user = useAppSelector(getUser);

  if (!user) {
    return (
      <Redirect to='/login' noThrow />
    );
  }

  return (
    <>{children}</>
  );
};