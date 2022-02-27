import React, { FC } from 'react';
import { useAppSelector } from '../../store';
import { getUser } from '../../store/auth/selectors';
import { Redirect, RouteComponentProps } from '@reach/router';
import { useDelayedRender } from '../../util/hooks/useDelayedRender.hook';
import { Spinner } from './Spinner';

export interface IProtectedRouteProps extends RouteComponentProps {
}

export const ProtectedRoute: FC<IProtectedRouteProps> = ({ children }) => {
  const { show } = useDelayedRender(1000); // give time for the current session to fetch on refresh
  const user = useAppSelector(getUser);

  if (!user && show) {
    return (
      <Redirect to='/login' noThrow />
    );
  }

  if (show) {
    return (
      <>{children}</>
    );
  }

  return <Spinner />
};