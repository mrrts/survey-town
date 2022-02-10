import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';

export interface ISpinnerProps {

}

export const Spinner: FC<ISpinnerProps> = () => {
  return (
    <div className='spinner-wrapper'>
      <FontAwesomeIcon className='spinner-icon' icon={faSpinner} />
    </div>
  );
}