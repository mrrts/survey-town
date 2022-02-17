import React, { FC, useEffect } from 'react';
import { useRequest } from '../../util/hooks/useRequest.hook';
import { Spinner } from './Spinner';
import { toastDanger } from '../../util/toast.util';

export interface IRequestInfoProps {
  requestKey: string;
}

export const RequestInfo: FC<IRequestInfoProps> = ({ requestKey }) => {
  const { isPending } = useRequest(requestKey);

  if (isPending) {
    return <Spinner />
  }

  return null;
}