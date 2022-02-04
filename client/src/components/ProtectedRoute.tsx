import React, { FC } from 'react';
import { useAppSelector } from '../store';
import { getUser } from '../store/auth/slice';
import { Redirect, RouteComponentProps } from '@reach/router';

export interface IProtectedRouteProps extends RouteComponentProps {
}

export const ProtectedRoute: FC<IProtectedRouteProps> = ({ children }) => {
  const user = useAppSelector(getUser);

  if (!user) {
    return (
      <Redirect to='/login' />
    );
  }

  return (
    <>{children}</>
  );
};