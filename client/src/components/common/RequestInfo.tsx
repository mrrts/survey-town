import React, { FC, useEffect } from 'react';
import { useRequest } from '../../util/hooks/useRequest.hook';
import { Spinner } from './Spinner';
import { toastDanger } from '../../util/toast.util';

export interface IRequestInfoProps {
  requestKey: string;
}

export const RequestInfo: FC<IRequestInfoProps> = ({ requestKey }) => {
  const { isPending, error } = useRequest(requestKey);

  useEffect(() => {
    if (error?.message) {
      toastDanger(error.message);
    }
  }, [error?.message]);

  if (isPending) {
    return <Spinner />
  }

  return null;
}