import { RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';

export interface ISurveysProps extends RouteComponentProps {

}

export const Surveys: FC<ISurveysProps> = () => {
  return (
    <div className='surveys'>
      Surveys Component
    </div>
  );
};