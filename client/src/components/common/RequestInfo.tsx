import React, { FC } from 'react';
import { useRequest } from '../../util/hooks/useRequest.hook';
import Alert from 'react-bootstrap/Alert';
import { Spinner } from './Spinner';

export interface IRequestInfoProps {
  requestKey: string;
}

export const RequestInfo: FC<IRequestInfoProps> = ({ requestKey }) => {
  const { isPending, error } = useRequest(requestKey);

  if (isPending) {
    return <Spinner />
  }

  if (error) {
    return (
      <Alert variant='danger'>
        {error.message}
      </Alert>
    );
  }

  return null;
}