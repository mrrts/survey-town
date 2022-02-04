import { RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';

export interface ISurveyProps extends RouteComponentProps {

}

export const Survey: FC<ISurveyProps> = () => {
  return (
    <div className='survey'>
      Survey
    </div>
  );
};