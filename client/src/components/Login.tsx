import { RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';

export interface ILoginProps extends RouteComponentProps {

}

export const Login: FC<ILoginProps> = () => {
  return (
    <div className='login'>
      Login
    </div>
  );
}